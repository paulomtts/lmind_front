import React from "react";
import ReactFlow, {
    Background
    , Controls
    , MiniMap
    , useNodesState
    , useEdgesState
    , addEdge
} from "reactflow";
import 'reactflow/dist/style.css';


const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];



export default function RoutesTab({

}: {

}) {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    React.useEffect(() => {
        console.log('nodes', nodes);
        console.log('edges', edges);
    }, [nodes, edges]);

    return (<>
        <div style={{ width: '100%', height: '95vh', borderRadius: '0.25rem' }} className="shadow-lg border-gray-200 border-2">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}

                style={{ borderRadius: '0.25rem' }}
            >
                <Controls />
                <Background className="bg-gray-200" color="transparent" /> { /* color refers to the Dots */}
                <MiniMap pannable inversePan maskColor="rgb(100,100,100)" nodeBorderRadius={15} />
            </ReactFlow>
        </div>
    </>);
}