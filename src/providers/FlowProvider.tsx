import React from "react";
import {
    useNodesState
    , useEdgesState
    , addEdge
    , Connection
    , Edge
    , Node
    , useReactFlow
} from "reactflow";
import 'reactflow/dist/style.css';
import { v4 } from "uuid";
import dagre from "@dagrejs/dagre";

import { DataRow } from "./data/models";
import TaskNode from "../components/Flow/TaskNode";


interface NodeInterface {
    id: string;
    position: {
        x: number;
        y: number;
    };
    type: string;
    data: {
        label: string;
        state: DataRow;
    };
}

interface EdgeInterface {
    id: string;
    source: string;
    target: string;
}

const nodeTypes = { 'tprod_tasks': TaskNode };

const FlowContext = React.createContext<any>(true);


function FlowProvider({ children }: { children: React.ReactNode }) {

    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

    const onConnect = React.useCallback( (params: Connection | Edge) => {
        if (params.source === params.target) return;
        setEdges((eds) => addEdge(params, eds))
    }, [setEdges]);


    /* Methods */
    const insertEdge = (source: Node, target: Node) => {
        const uuid = v4();

        const newEdge: EdgeInterface = {
            id: uuid,
            source: source.id,
            target: target.id,
        };

        setEdges((eds) => [...eds, newEdge as Edge]);
    }

    const removeEdge = (id: string) => {
        setEdges((eds) => eds.filter((e) => e.id !== id));
    }

    const insertNode = (
        { label, state }: { label: string, state: DataRow }
        , parents: Node[] = []
        , children: Node[] = []
    ) => {
        const uuid = v4();

        const newNode = {
            id: uuid,
            position: { x: 0, y: 0 },
            type: state.tableName,
            data: {
                label: label,
                state: state
            }
        } as NodeInterface;

        setNodes((nds) => [...nds, newNode as Node]);

        parents.forEach((p) => insertEdge(p, newNode));
        children.forEach((c) => insertEdge(newNode, c));

        return newNode;
    }

    const updateNode = (id: string, state: DataRow) => {
        setNodes((nds) => nds.map((n) => {
            if (n.id !== id) return n;
            return { ...n, data: { ...n.data, state: state } };
        }));
    }

    const removeNode = (id: string) => {
        const edgesToRemove = edges.filter((e) => e.source === id || e.target === id);
        edgesToRemove.forEach((e) => removeEdge(e.id));
        
        setNodes((nds) => nds.filter((n) => n.id !== id));
    }


    /* Layout */
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    const nodeWidth = 216;
    const nodeHeight = 72;

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
        await buildLayout();
        fitView();
    }


    const values = {
        nodes, 
        onNodesChange,
        edges, 
        onEdgesChange,
        onConnect,

        insertNode,
        updateNode,
        removeNode,
        insertEdge,
        removeEdge,

        arrangeNodes
    };

    return (
        <FlowContext.Provider value={values}>
            {children}
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


export { FlowProvider, useFlow, nodeTypes };