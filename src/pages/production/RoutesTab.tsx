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
        console.log('----------------------------------------')
        nodes.forEach(nd => {
            const newNode = new DataRow('tsys_nodes', {
                id_object: 1 // tag id
                , reference: 'tprod_producttags' // tag table
                , type: 'tprod_tasks' // contained object table
                , uuid: nd.id
                , layer: nd.data.layer
                , quantity: 1
                , position: JSON.parse(JSON.stringify(nd.position))
            })
            console.log(newNode.json);
        }); 
    }

    const uuid = v4()
    const baseState = {
        task: task
    }

    const nodeA = React.useRef({
        id: uuid
        , type: 'task'
        , position: { x: 0, y: 0 }
        , data: {
            state: baseState
            , ancestors: []
            , layer: 0
        }
    });

    return (<>
        {nodeA.current && <Flow baseState={baseState} nodeObjects={[nodeA.current]} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}