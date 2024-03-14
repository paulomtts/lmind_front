import React from "react";
import { Node, Edge } from "reactflow";

import { DataRow } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";
import Flow from "../../components/Flow/Flow";
import { FlowParser } from "../../components/Flow/FlowParser";


export default function RoutesTab({}: {}) {

    const [task, setTask] = React.useState<DataRow>(new DataRow('tprod_tasks'));
    
    const baseStates = {
        task: { 
            task: task 
        }
    }
    const nodeA = React.useRef(FlowParser.inputNode('task', null, null, baseStates.task));

    React.useEffect(() => {
        const retrieveTasksData = async () => {
            const { response, data } = await CRUD.select('tprod_tasks', {notification: false});
    
            if (response.ok) {
                const field = task.getField('name');
    
                field.props.data = data;
                setTask(task);
            }
        }

        retrieveTasksData();
    }, []);
   

    const handleFlowChange = (nodes: Node[], edges: Edge[]) => {       
        const upsertNodes = nodes.map(nd => {
            return FlowParser.outputNode(nd);
        });

        const upsertEdges = edges.map(ed => {
            return FlowParser.outputEdge(ed, 1, 'tprod_producttags');
        });

        const upsertRoutes = nodes.map(nd => {
            return FlowParser.outputRoute(nd);
        });


        
        upsertNodes.forEach((nd) => {
            console.log(nd);
        });
        upsertRoutes.forEach((nd) => {
            console.log(nd);
        });

    }


    return (<>
        {nodeA.current && <Flow baseStates={baseStates} nodeObjects={[nodeA.current]} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}