import React from "react";
import ReactFlow, {
    Controls
    , MiniMap
} from "reactflow";
import 'reactflow/dist/style.css';

import { useFlow, nodeTypes } from "../../../providers/FlowProvider";
import { DataRow } from "../../../providers/data/models";


export default function RoutesTab({

}: {

}) {

    const { 
        nodes, onNodesChange
        , edges, onEdgesChange
        , onConnect 

        , insertNode
        , updateNode
        , removeNode
        , insertEdge
        , removeEdge

        , arrangeNodes
    } = useFlow();

    React.useEffect(() => {
        if (nodes.length > 0) return;
        if (edges.length > 0) return;

        const newNodeA = insertNode({ label: 'A', state: new DataRow('', {}) });
        const newNodeB = insertNode({ label: 'B', state: new DataRow('', {}) }, [newNodeA]);
        const newNodeC = insertNode({ label: 'C', state: new DataRow('', {}) }, [newNodeB]);
        const newNodeD = insertNode({ label: 'D', state: new DataRow('', {}) }, [newNodeA]);
        const newNodeE = insertNode({ label: 'E', state: new DataRow('', {}) }, [newNodeD, newNodeB]);
    }, []);



    return (<>
        <div style={{ height: '65vh', maxHeight: '100%', borderRadius: '0.25rem' }} className="shadow-lg border-gray-200 border-2">
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
                <MiniMap pannable inversePan maskColor="rgb(100,100,100)" nodeBorderRadius={15} />
            </ReactFlow>
        </div>
    </>);
}