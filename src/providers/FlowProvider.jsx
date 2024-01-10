/* Foreign dependencies */
import React, { useContext, createContext, useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge } from "reactflow";
import { v4 } from "uuid";
import dagre from "dagre";

export const FlowContext = createContext();

export function FlowProvider({ children, nodeWidth, nodeHeight }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([buildNode(null, 0)]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [removedNodes, setRemovedNodes] = useState([]);
    
    const onConnect = useCallback((params) => {
        if (params.source !== params.target) {
            setEdges((els) => addEdge(params, els))
        }
    }, [setEdges]);

    /* Factories */         
    function buildNode(nodeId, nodeLevel, nodeObject = {}) {
        const uuid = v4();      
        return {
            id: `${nodeId??uuid}`
            , position: {x: 0, y: 0}
            , draggable: true
            , type: "task"
            , data: { 
                level: nodeLevel
                , quantity: 1
                , content: {}
                , object: nodeObject
            }
        };
    }
    
    function buildEdge(sourceId, targetId) {
        const uuid = v4();
        return {
            id: `e${uuid}`,
            source: `${sourceId}`,
            target: `${targetId}`,
            sourceHandle: 'output',
            type: 'default',
            style: {stroke: 'gray', strokeWidth: 1.5},
        };
    }

    /* Functions */
    function addNode(sourceId, sourceLevel) {
        const newNode = buildNode(null, sourceLevel + 1);
        const newEdge = buildEdge(sourceId, newNode.id);

        return {newNode: newNode, newEdge: newEdge};
    }

    function removeNode(nodeId) {
        const filteredNodes = nodes.filter((node) => {
            if (node.id !== nodeId) {
                return node;
            } else {
                const removedId = Object.keys(node.data.object).length > 0 ? node.data.object.id_route : null;
                if (removedId !== null) {
                    setRemovedNodes([...removedNodes, removedId]);
                }
            }

            return null;
        });

        const upperEdge = edges.filter((edge) => edge.target === nodeId)[0];
        const lowerEdge = edges.filter((edge) => edge.source === nodeId);
        
        lowerEdge.forEach((edge) => {
            edge.source = upperEdge ? upperEdge.source : null;
        });

        const filteredEdges = edges.filter((edge) => edge.id !== upperEdge.id);

        return {filteredNodes: filteredNodes, filteredEdges: filteredEdges};
    }

    function updateNode(nodeId, newData) {
        const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
                return {
                    ...node
                    , data: {
                        ...node.data
                        , ...newData
                    }
                };
            }
            return node;
        });

        setNodes(updatedNodes);
    }

    /* Layouting */
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });
    
    const getLayoutedElements = (nodes, edges) => {
        if (!nodes) return;

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });
        
        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });
        
        dagre.layout(dagreGraph);
        
        nodes.map((node) => { // necessary to match dagre node anchor point (center) with react-flow node anchor point (top-left)
            const position = dagreGraph.node(node.id);
            node.targetPosition = 'top';
            node.sourcePosition = 'bottom';
            
            node.position = {
                x: position.x - nodeWidth / 2,
                y: position.y - nodeHeight / 2,
            };

            return node;
        });

        setNodes(nodes);
        setEdges(edges);

        return {layoutedNodes: nodes, layoutedEdges: edges};
    };

    return (
        <FlowContext.Provider value={{ 
            onNodesChange
            , onEdgesChange
            , onConnect

            // factories
            , buildNode
            , buildEdge

            // functions
            , addNode
            , removeNode
            , updateNode

            // layouting
            , getLayoutedElements

            // states
            , nodes
            , setNodes
            , edges
            , setEdges
            , removedNodes
            , setRemovedNodes            
        }}>
            {children}
        </FlowContext.Provider>
    );
}

export const useFlow = () => {
    return useContext(FlowContext);
}