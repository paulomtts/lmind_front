import React from "react";
import { Node, Edge } from "reactflow";
import { v4 } from "uuid";

import { DataRow } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";
import Flow from "../../components/Flow/Flow";


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
        // console.log('Edges:', edges);
    }

    const uuid = v4()
    const baseState = {
        node: new DataRow('tsys_nodes', {
            id_object: 999
            , reference: 'tprod_producttags'
            , type: 'tprod_tasks'
            , uuid: uuid
            , layer: 0
            , quantity: 1
        })
        , task: task
    }

    const nodeA = React.useRef({
        id: uuid
        , type: 'task'
        , position: { x: 0, y: 0 }
        , data: {
            state: baseState
            , ancestors: []
        }
    });

    return (<>
        {nodeA.current && <Flow baseState={baseState} nodeObjects={[nodeA.current]} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}