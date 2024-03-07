import React from "react";
import { Node, Edge } from "reactflow";

import { Flow } from "../../components/Flow/Flow";
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
            console.log('Node:', node);
        });
        console.log('Edges:', edges);
    }

    // Nodes
    const nodeA = React.useRef<NodeObject>();
    
    React.useEffect(() => {
        nodeA.current = new NodeObject('tasks', { x: 0, y: 0 }, 0, {tasks: task});


        setTimeout(() => {
            let currentNode = nodeA.current;
            for (let i = 0; i < 2; i++) {
                currentNode = currentNode?.addChild();
            }
        }, 100);

    }, [task]);
    
    // Edges
    // const eAB = new DataRow('tsys_edges', {
    //     id_object: 1
    //     , reference: 'tprod_producttags'
    //     , type: 'task'
    //     , source_uuid: nodeA.current.id
    //     , target_uuid: nodeB.current.id
    // });

    // const eAC = new DataRow('tsys_edges', {
    //     id_object: 1
    //     , reference: 'tprod_producttags'
    //     , type: 'task'
    //     , source_uuid: nodeA.current.id
    //     , target_uuid: nodeC.current.id
    // });

    return (<>
        {nodeA.current && <Flow nodeObjects={[nodeA.current]} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}