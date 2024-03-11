import React from "react";
import { Node, Edge } from "reactflow";

import { Flow } from "../../components/Flow/Flow";
import { DataRow } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";
import { v4 } from "uuid";


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
            console.log('Node:', node.data.state.tasks.json);
        });
        console.log('Edges:', edges);
    }


    const nodeA = React.useRef({
        id: v4()
        , type: 'tasks'
        , position: { x: 0, y: 0 }
        , data: {
            state: {
                node: new DataRow('tsys_nodes', {
                    id_object: 999
                    , reference: 'tprod_producttags'
                    , type: 'tprod_tasks'
                    , uuid: v4()
                    , layer: 0
                    , quantity: 1
                })
                , tasks: task
            }
            , methods: {}
        }
    });

    return (<>
        {nodeA.current && <Flow nodeObjects={[nodeA.current]} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}