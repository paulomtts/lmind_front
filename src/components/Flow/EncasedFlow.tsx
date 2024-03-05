import React from "react";
import ReactFlow, {
    Controls
    , MiniMap
} from "reactflow";
import 'reactflow/dist/style.css';

import { useFlow, nodeTypes } from "../../providers/FlowProvider";
import { DataRow } from "../../providers/data/models";


export default function EncasedFlow({
    nodesData
    , edgesData
}: {
    nodesData: DataRow[];
    edgesData: DataRow[];
}) {

    const { 
        nodes, setNodes, onNodesChange
        , edges, setEdges, onEdgesChange
        , onConnect 

        , insertNode
        , updateNode
        , removeNode
        , insertEdge
        , removeEdge

        , arrangeNodes
    } = useFlow();

    React.useEffect(() => {
        if (nodesData.length > 0) {
            setNodes([]);

            nodesData.forEach(node => {
                insertNode(node);
            });
            arrangeNodes();
        }
    }, [nodesData]);

    React.useEffect(() => {
        if (edgesData.length > 0) {
            setEdges([]);

            edgesData.forEach(edge => {
                const { source_uuid, target_uuid } = edge.json;
                insertEdge(source_uuid, target_uuid);
            });
        }
    }, [edgesData]);


    return (
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
            </ReactFlow>
        </div>
    );
}