import { Node, Edge } from "reactflow";
import { DataRow } from "../../providers/data/models";
import { v4 } from "uuid";

export class FlowParser {

    /* Generic */
    static inputEdge (edge: DataRow) {
        return {
            id: edge.json.id
            , type: "default"
            , source: edge.json.source_uuid
            , target: edge.json.target_uuid
        }
    }

    static outputEdge (edge: Edge, idObject: number, reference: string) {
        return {
            id: typeof edge.id === 'number'? edge.id : null
            , id_object: idObject
            , reference: reference
            , source_uuid: edge.source
            , target_uuid: edge.target
            , type: "default"
        }
    }

    static inputNode (type: string, object: DataRow | null = null, node: DataRow | null = null, state: Record<string, DataRow>) {
        const uuid = node?.json.uuid??v4()
        
        const newNode = {
            id: uuid
            , type: type
            , position: node?.json.position??{ x: 0, y: 0 }
            , data: {
                ancestors: node ? node.json.ancestors : []
                , layer: node ? node.json.layer : 0
                , quantity: node ? node.json.quantity : 1
                // these are kept apart from the node:DataRow to preserve the original data

                , state: state
                , sources: {
                    node: node ? node.clone() : new DataRow('tsys_nodes')
                    , object: object ? object.clone() : null
                }
            }
        }
        return newNode;
    }

    static outputNode (node: Node) {
        const sourceNode = node.data.sources.node;

        const newNode = {
            id: sourceNode.json.id
            , id_object: sourceNode.json.id_object
            , reference: sourceNode.json.reference
            , type: node.type??'default'
            , uuid: node.id
            , layer: node.data.layer
            , position: JSON.stringify(node.position)
            , ancestors: node.data.ancestors
        }
        return newNode;
    }


    /* Specific */
    static outputRoute (node: Node, idTag: number | null = null) {
        const sourceObject = node.data.sources.object;

        const newRoute = {
            id: sourceObject ? sourceObject.json.id : null
            , id_tag: idTag ?? sourceObject ? sourceObject.json.id_tag : null
            , id_task: node.data.state.task.json.id
            , quantity: node.data.quantity
        }

        if (newRoute.id === null) delete newRoute.id;
        return newRoute;
    }
}