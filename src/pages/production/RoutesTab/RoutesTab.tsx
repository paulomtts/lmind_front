import React from "react";
import ReactFlow, {
    Background
    , Controls
    , MiniMap
    , useNodesState
    , useEdgesState
    , addEdge
    , Connection
    , Edge
} from "reactflow";
import 'reactflow/dist/style.css';

import TaskNode from "../../../components/Flow/TaskNode";


const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Task A' } },
    { id: '2', position: { x: 0, y: 100 }, type: 'task', data: { label: 'Task B' } },
  ];
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'wow' }
];


const nodeTypes = { 'task': TaskNode };

export default function RoutesTab({

}: {

}) {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = React.useCallback( (params: Connection | Edge) => {
        setEdges((eds) => addEdge(params, eds))
    }, [setEdges]);

    return (<>
        <div style={{ width: '100%', height: '90vh', borderRadius: '0.25rem' }} className="shadow-lg border-gray-200 border-2">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}

                fitView

                style={{ borderRadius: '0.25rem' }}
            >
                <Controls />
                {/* <Background className="bg-gray-200" color="transparent" /> */}
                <MiniMap pannable inversePan maskColor="rgb(100,100,100)" nodeBorderRadius={15} />
            </ReactFlow>
        </div>
    </>);
}