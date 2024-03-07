import React from "react";
import { Node, Edge } from "reactflow";

import { FlowProvider } from "../../components/Flow/Flow";
import { DataRow } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";
import { NodeObject } from "../../components/Flow/models";


export default function RoutesTab({

}: {

}) {

    const [task, setTask] = React.useState<DataRow>(new DataRow('tprod_tasks'));

    React.useEffect(() => {
        retrieveTasksData();
    }, []);
    
    const retrieveTasksData = async () => {
        const { response, data } = await CRUD.select('tprod_tasks', {notification: false});

        if (response.ok) {
            const field = task.getField('name');

            field.props.data = data;
            setTask(task);
        }
    }

    const handleFlowChange = (nodes: Node[], edges: Edge[]) => {
        nodes.forEach(node => {
            console.log('Node:', node.data.state.tasks.json.id, node.position);
        });
        console.log('Edges:', edges);
    }

    // Nodes
    const nodeA = React.useRef(new NodeObject('task', {tasks: task}));
    const nodeB = React.useRef(new NodeObject('task', {tasks: task}));
    const nodeC = React.useRef(new NodeObject('task', {tasks: task}));

    // if(nodeB.current && nodeA.current.data.methods.insertNode) nodeA.current.data.methods.insertNode(nodeB.current, [], []);

    // Edges
    const eAB = new DataRow('tsys_edges', {
        id_object: 1
        , reference: 'tprod_producttags'
        , type: 'task'
        , source_uuid: nodeA.current.id
        , target_uuid: nodeB.current.id
    });

    const eAC = new DataRow('tsys_edges', {
        id_object: 1
        , reference: 'tprod_producttags'
        , type: 'task'
        , source_uuid: nodeA.current.id
        , target_uuid: nodeC.current.id
    });

    return (<>
        <FlowProvider nodeObjects={[nodeA.current, nodeB.current, nodeC.current]} edgeObjects={[eAB, eAC]} onChange={handleFlowChange} />
    </>);
}