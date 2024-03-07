import React from "react";
import ReactFlow, {
    useNodesState
    , useEdgesState
    , addEdge
    , Connection
    , Edge
    , Node
    , useReactFlow
    , Controls
    , MiniMap
    , Background
} from "reactflow";
import 'reactflow/dist/style.css';
import { v4 } from "uuid";
import dagre from "@dagrejs/dagre";

import { DataRow } from "../../providers/data/models";
import TaskNode from "./TaskNode";
import { EdgeInterface } from "./interfaces";
import { NodeObject } from "./models";


const nodeTypes = { 'task': TaskNode };
const FlowContext = React.createContext<any>(true);


function Flow({
    nodeObjects
    , edgeObjects
    , onChange
}: {
    nodeObjects: NodeObject[];
    edgeObjects: DataRow[];
    onChange: (nodes: Node[], edges: Edge[]) => void;
}) {

    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

    const onConnect = React.useCallback( (params: Connection | Edge) => {
        if (params.source === params.target) return;
        setEdges((eds) => addEdge(params, eds))
    }, [setEdges]);


    /* Effects */
    React.useEffect(() => {
        if (nodeObjects.length > 0) {
            setNodes([]);

            nodeObjects.forEach(obj => {
                obj.data.methods = {
                    ...obj.data.methods,
                    insertNode: insertNode,
                    onStateChange: onStateChange
                }; // reason: dependency injection

                insertNode(obj);
            });
            arrangeNodes();
        }
    }, [nodeObjects]);

    React.useEffect(() => {
        if (edgeObjects.length > 0) {
            setEdges([]);

            edgeObjects.forEach(edge => {
                const { source_uuid, target_uuid } = edge.json;
                insertEdge(String(source_uuid), String(target_uuid));
            });
        }
    }, [edgeObjects]);


    /* Methods */
    const insertEdge = (source_uuid: string, target_uuid: string) => {
        const uuid = v4();

        const newEdge: EdgeInterface = {
            id: uuid,
            source: source_uuid,
            target: target_uuid
        } as EdgeInterface;

        setEdges((eds) => [...eds, newEdge as Edge]);
    }

    const removeEdge = (id: string) => {
        setEdges((eds) => eds.filter((e) => e.id !== id));
    }

    const insertNode = (node: NodeObject, parents: NodeObject[] = [], children: NodeObject[] = []) => {
        setNodes((nds) => [...nds, node as Node]);

        parents.forEach((p) => insertEdge(p.id, node.id));
        children.forEach((c) => insertEdge(node.id, c.id));
    }

    const removeNode = (id: string) => {
        const edgesToRemove = edges.filter((e) => e.source === id || e.target === id);
        edgesToRemove.forEach((e) => removeEdge(e.id));
        
        setNodes((nds) => nds.filter((n) => n.id !== id));
    }


    /* Handlers */
    const onStateChange = (id: string, state: Record<string, DataRow>) => {
        setNodes(currentNodes => { // reason: setNodes is needed because of closure
            const newNodes = currentNodes.map((node: Node) => {
                if (node.id === id) {
                    node.data.state = state;
                }
                return node;
            });

            onChange(newNodes, edges);
            return newNodes;
        });
    }


    /* Layout */
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    const nodeWidth = 256;
    const nodeHeight = 288;

    const { fitView } = useReactFlow();

    const buildLayout = async () => {
        const newNodes = nodes.map((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
            return node;
        });
        
        const newEdges = edges.map((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
            return edge;
        });

        dagre.layout(dagreGraph, { rankdir: 'TB' });

        newNodes.map((node) => { // necessary to match dagre node anchor point (center) with react-flow node anchor point (top-left)
            const position = dagreGraph.node(node.id);
           
            node.position = {
                x: position.x - nodeWidth / 2,
                y: position.y - nodeHeight / 2,
            };


            return node;
        });
        setNodes(newNodes);
        setEdges(newEdges);
    };

    const arrangeNodes = async () => {
        if (nodes.length > 0) await buildLayout();
        fitView();
    }


    const values = {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        onConnect,

        insertNode,
        removeNode,
        insertEdge,
        removeEdge,

        arrangeNodes
    };

    return (
        <FlowContext.Provider value={values}>
            <div style={{ height: '80vh', borderRadius: '0.25rem' }} className="shadow-lg border-gray-200 border-2">
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    style={{ borderRadius: '0.25rem', height: '100%' }}
                    fitView
                >
                    <Controls onFitView={arrangeNodes} />
                    <MiniMap pannable inversePan maskColor="rgba(100,100,100, 0.25)" nodeBorderRadius={15} />
                    <Background className="bg-slate-100" gap={16} />
                </ReactFlow>
            </div>
        </FlowContext.Provider>
    );
}

const useFlow = () => {
    const context = React.useContext(FlowContext);
    if (context === undefined) {
        throw new Error('useFlow must be used within a FlowProvider');
    }
    return context;
};


export { Flow as FlowProvider, useFlow, nodeTypes };