import React from "react";
import { Node, Edge } from "reactflow";

import { DataRow } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";
import Flow from "../../components/Flow/Flow";
import { FlowParser } from "../../components/Flow/FlowParser";
import { Button } from "@chakra-ui/react";
import { NodeInterface, EdgeInterface, RouteInterface } from "../../components/Flow/interfaces";
import { TProdRoutes } from "../../providers/data/routes/TProd";
import BasicTagInput from "../../components/TagInput/BasicTagInput";
import { ProductTagInterface } from "../../providers/data/routes/interfaces";


export default function RoutesTab({}: {}) {

    const tag = React.useRef<ProductTagInterface | Record<string, any>>({});
    const task = React.useRef(new DataRow('tprod_tasks'));
    const baseState = {task: task.current}

    const nodes = React.useRef<Node[]>([FlowParser.inputNode('task', null, baseState)]);
    const edges = React.useRef<Edge[]>([]);

    React.useEffect(() => {
        const retrieveTasksData = async () => {
            const { response, data } = await CRUD.select('tprod_tasks', {notification: false});
    
            if (response.ok) {
                const field = task.current.getField('name');
    
                field.props.data = data;
                
            }
        }

        retrieveTasksData();
    }, []);
   

    const handleFlowChange = (currentNodes: Node[], currentEdges: Edge[]) => {   
        nodes.current = currentNodes;
        edges.current = currentEdges;
        
    }

    const handleTagSubmit = (row: DataRow) => {
        console.log(row)
        tag.current = row.json;
    }

    const handleSubmit = async () => {
        const upsertNodes = nodes.current.map(nd => {
            return FlowParser.outputNode(nd);
        });

        const upsertEdges = edges.current.map(ed => {
            return FlowParser.outputEdge(ed);
        });

        const routeData = nodes.current.map((node: Node) => {
            return { 
                id_task: node.data.state.task.getField('id').value 
                , node_uuid: node.id
            };
        });

        const { response, data } = await TProdRoutes.upsert(tag.current, upsertNodes, upsertEdges, routeData);

        if (!response.ok) return;
        console.log(data)

        // const newNodes = data['tsys_nodes'].rows.map((node: DataRow) => {
        //     // new to build task object here containing the rererenced task data
        //     return FlowParser.inputNode(
        //         'task'
        //         , node.json
        //         , baseState // CHANGE HERE TO INCLUDE TASK
        //     );
        // });
        // const newEdges = data['tsys_edges'].json.map((edge: Record<string, any>) => {
        //     return FlowParser.inputEdge(edge['source_uuid'], edge['target_uuid']);
        // });

        // console.log(newNodes)

        // setCurrentNodes(newNodes);
        // setCurrentEdges(newEdges);
    }



    return (<>
        <div className="flex gap-2">
            <BasicTagInput tableName={'tprod_producttags'} mode={'create'} onSubmit={handleTagSubmit} />
            <Button className="mt-8" onClick={() => handleSubmit()}>Save</Button>
        </div>
        {<Flow baseState={baseState} nodeObjects={nodes.current} edgeObjects={[]} onChange={handleFlowChange} />}
    </>);
}