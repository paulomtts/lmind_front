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
    , Panel
    , useOnViewportChange
    , Viewport
} from "reactflow";
import 'reactflow/dist/style.css';
import { Button, Switch, Select, Kbd } from "@chakra-ui/react";
import { faAdd, faDiagramProject, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dagre from "@dagrejs/dagre";
import { v4 } from "uuid";

import { DataRow } from "../../providers/data/models";
import TaskNode from "./TaskNode";


const nodeTypes = { 'task': TaskNode };
const FlowContext = React.createContext<any>(true);


export default function Flow({
    baseState
    , nodeObjects
    , edgeObjects
    , onChange
}: {
    baseState: Record<string, DataRow>;
    nodeObjects: Record<string, any>[];
    edgeObjects?: DataRow[];
    onChange: (nodes: Node[], edges: Edge[]) => void;
}) {

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState<number>(0);

    const flowRef = React.useRef<any>(null);
    const [viewport, setViewport] = React.useState<Viewport>({x: 0, y: 0, zoom: 0.5} as Viewport);

    useOnViewportChange({
        onChange: (viewport: Viewport) => setViewport(viewport)
    });
    
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

    const [arrangeIsDisabled, setArrangeIsDisabled] = React.useState<boolean>(false);

    const [currentType, setCurrentType] = React.useState<string>(''); // ['task', 'decision', 'start', 'end'
    const [arrangeOnChange, setArrangeOnChange] = React.useState<boolean>(false);
    const [fitOnChange, setFitOnChange] = React.useState<boolean>(false);


    const onConnect = React.useCallback( (params: Connection | Edge) => {
        if (params.source === params.target) return; // reason: prevent self-connections

        const source = nodes.find((nd: Node) => nd.id === params.source) as Node;
        if (source.data.ancestors.includes(params.target)) return; // reason: prevent circular references

        setEdges((eds) => addEdge(params, eds))
        adoptChild(params as Edge);
    }, [edges, nodes]);


    /* Effects */
    React.useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const availableHeight = containerRef.current.parentElement?.parentElement?.parentElement?.clientHeight || 0;
                const navbarHeight = containerRef.current.parentElement?.parentElement?.parentElement?.parentElement?.children[0].clientHeight || 0;
                const twoRem = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
                
                setHeight(availableHeight - navbarHeight - twoRem - 2);
            }
        };
    
        handleResize();
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // reason: flow dimensioning

    React.useEffect(() => {
        if (nodeObjects.length > 0) {
            setNodes([]);

            nodeObjects.forEach(obj => {
                insertNode(obj as Node);
            });
        }
    }, [nodeObjects]);

    React.useEffect(() => {
        if (!edgeObjects) return;
        if (edgeObjects.length > 0) {
            setEdges([]);

            edgeObjects.forEach(edge => {
                const { source_uuid, target_uuid } = edge.json;
                insertEdge(String(source_uuid), String(target_uuid));
            });
        }
    }, [edgeObjects]);

    React.useEffect(() => {
        if (arrangeOnChange && nodes.length > 0) arrangeNodes();
        if (fitOnChange) {
            setTimeout(() => {
                fitView({padding: 0.5});
            }, 25);
        }
    }, [nodes.length]);


    /* Methods */
    const insertEdge = (source_uuid: string, target_uuid: string) => {
        const uuid = v4();

        const newEdge = {
            id: uuid,
            source: source_uuid,
            target: target_uuid
        } as Edge;

        setEdges((eds) => [...eds, newEdge as Edge]);
    };

    const removeEdge = (id: string) => {
        setEdges((eds) => eds.filter((e) => e.id !== id));
    };
    
    const insertNode = (node: Node, parents: Node[] = [], children: Node[] = []) => {
        setNodes((nds) => [...nds, node as Node]);

        parents.forEach((p) => insertEdge(p.id, node.id));
        children.forEach((c) => insertEdge(node.id, c.id));
    };

    const removeNode = (id: string) => {
        const edgesToRemove = edges.filter((e) => e.source === id || e.target === id);
        edgesToRemove.forEach((e) => removeEdge(e.id));
        
        setNodes((currentNodes) => {
            const parent = currentNodes.find((nd: Node) => nd.id === id) as Node;
            const children = currentNodes.filter((nd: Node) => nd.data.ancestors.includes(id));

            const toRemove = [...parent.data.ancestors, parent.id];
            children.forEach((child: Node) => {
                child.data.ancestors = child.data.ancestors.filter((a: string) => toRemove.includes(a) === false)
                child.data.layer = child.data.ancestors.length;
                console.log(child)
            });

            const newNodes = currentNodes.filter((nd: Node) => nd.id !== id);
            onChange(newNodes, edges);  

            return newNodes;
        });
    };

    const insertChild = (parentId: string) => {
        setNodes((nds) => {
            const parent = nds.find((n) => n.id === parentId) as Node;
            if (!parent) return nds;

            const uuid = v4();

            const newState = Object.keys(parent.data.state).reduce((acc, key) => {
                acc[key] = parent.data.state[key].clone(true);
                return acc;
            }, {} as Record<string, DataRow>);

            const newChild = {
                id: uuid
                , type: parent.type
                , position: { x: parent.position.x, y: parent.position.y + 288 }
                , data: {
                    ...parent.data
                    , state: newState
                    , ancestors: [...parent.data.ancestors, parent.id]
                    , layer: parent.data.layer + 1
                }
            } as Node;

            insertEdge(parentId, uuid);
            return [...nds, newChild];
        });
    };

    const adoptChild = (edge: Edge) => {
        setNodes((currentNodes) => {

            const parent = currentNodes.find((n) => n.id === edge.source) as Node;
            const child = currentNodes.find((n) => n.id === edge.target) as Node;
            
            if (!parent || !child) return currentNodes;

            const descendants = currentNodes.filter((nd: Node) => nd.data.ancestors.includes(child.id));
            const toAdopt = [child, ...descendants];

            toAdopt.forEach((nd: Node) => {
                nd.data.ancestors = [...parent.data.ancestors, parent.id, ...nd.data.ancestors]
                nd.data.layer = nd.data.ancestors.length;
            });

            onChange(currentNodes, edges);
            return currentNodes;
        });
    };


    /* Layout */
    const nodeWidth = 256;
    const nodeHeight = 288;

    const { fitView } = useReactFlow();

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

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
    };


    /* Handlers */
    const onStateChange = (id: string, state: Record<string, DataRow>) => {
        setNodes(currentNodes => { // reason: setNodes is needed because of closure
            const newNodes = currentNodes.map((currNd: Node) => {
                if (currNd.id === id) {
                    currNd.data.state = state;
                }

                return currNd;
            });

            onChange(newNodes, edges);
            return newNodes;
        });
    };

    const onInsertClick = () => {
        if (!currentType) return;

        const newNode = {
            id: v4(),
            type: currentType,
            position: { x: -(viewport.x/viewport.zoom) + 100/viewport.zoom, y: -(viewport.y/viewport.zoom) + 100/viewport.zoom },
            data: {
                state: baseState
                , ancestors: []
                , layer: 0
            },
        } as Node;

        insertNode(newNode);
    };


    /* Context & JSX */
    const values = {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        onConnect,

        addChild: insertChild,
        onStateChange,

        insertNode,
        removeNode,
        insertEdge,
        removeEdge,
    };

    return (
        <FlowContext.Provider value={values}>
            <div ref={containerRef} style={{ height: `${height}px`, borderRadius: '0.25rem' }} className="shadow-lg border-gray-200 border-2">
                <ReactFlow 
                    ref={flowRef}
                    nodes={nodes} 
                    edges={edges} 
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    style={{ borderRadius: '0.25rem', height: '100%' }}
                    disableKeyboardA11y
                    fitView
                    minZoom={0.05}
                >
                    <MiniMap pannable inversePan maskColor="rgba(100,100,100, 0.25)" nodeBorderRadius={15} />
                    <Background className="bg-slate-100" gap={16} />
                    <Controls onInteractiveChange={() => setArrangeIsDisabled(!arrangeIsDisabled)} showFitView={false} />
                    <Panel position="top-right" className="flex flex-col gap-3 p-2 pt-4 pb-4 bg-white rounded-md shadow-lg border-1 border-gray-300">
                        <div className="flex flex-col gap-2">
                            <Button 
                                aria-label="Arrange nodes"
                                size="sm"
                                className="w-full gap-2"
                                colorScheme="teal"
                                variant={"outline"}
                                title="Click to arrange nodes in a tree-like structure"
                                isDisabled={currentType === ''}
                                onClick={() => onInsertClick()}
                            >
                                <FontAwesomeIcon icon={faAdd} />
                                Add Node
                            </Button>  

                            <Select 
                                size="sm"
                                colorScheme="teal"
                                placeholder="Select a node type"
                                onChange={(e) => setCurrentType(e.target.value)}
                            >
                                <option value="task">Task</option>
                            </Select>
                        </div>

                        <hr />

                        <Button 
                            aria-label="Arrange nodes"
                            size="sm"
                            className="w-full gap-2"
                            colorScheme="teal"
                            variant={"outline"}
                            title="Click to arrange nodes in a tree-like structure"
                            isDisabled={arrangeIsDisabled}
                            onClick={arrangeNodes}
                        >
                            <FontAwesomeIcon icon={faDiagramProject} />
                            Arrange
                        </Button>

                        <Switch 
                            id="arrangeOnInsert"
                            colorScheme="teal"
                            isChecked={arrangeOnChange}
                            size={'sm'}
                            className="ml-1"
                            onChange={() => setArrangeOnChange(!arrangeOnChange)}
                        >
                            Auto arrange
                        </Switch>

                        <Button 
                            aria-label="Arrange nodes"
                            size="sm"
                            className="w-full gap-2"
                            colorScheme="teal"
                            variant={"outline"}
                            title="Click to arrange nodes in a tree-like structure"
                            onClick={() => fitView({padding: 0.5})}
                        >
                            <FontAwesomeIcon icon={faExpand} />
                            Fit view
                        </Button>

                        <Switch 
                            id="arrangeOnInsert"
                            colorScheme="teal"
                            isChecked={fitOnChange}
                            size={'sm'}
                            className="ml-1"
                            onChange={() => setFitOnChange(!fitOnChange)}
                        >
                            Auto fit
                        </Switch>
                    </Panel>

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


export { useFlow };