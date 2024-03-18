import { Node, Edge } from "reactflow";
import { DataRow } from "../../providers/data/models";
import { v4 } from "uuid";
import { EdgeInterface, NodeInterface, RouteInterface } from "./interfaces";

export class FlowParser {

    static parseOutput(object: any) {
        if (object.id !== undefined && object.id === '') {
            delete object.id;
        }
        
        return object;
    }

    /* Generic */
    static inputEdge (source_uuid: string, target_uuid: string) {
        return {
            id: v4()
            , source: source_uuid
            , target: target_uuid
            , type: "default"
        } as Edge;
    }

    static outputEdge (edge: Edge) {
        const newEdge = {
            id: ''
            , id_object: ''
            , reference: ''
            , source_uuid: edge.source
            , target_uuid: edge.target
            , type: "default"
        } as EdgeInterface;

        return FlowParser.parseOutput(newEdge);
    }

    static inputNode (type: string, node: DataRow | null = null, state: Record<string, DataRow>) {
        const uuid = node?.json.uuid??v4()
        
        return {
            id: uuid
            , type: type
            , position: node?.json.position??{ x: 0, y: 0 }
            , data: {
                src: {
                    id: node ? node.json.id : ''
                    , id_object: node ? node.json.id_object : ''
                    , reference: node ? node.json.reference : ''
                } // reason: avoid each node holding a big data structure
                , ancestors: node ? node.json.ancestors : []
                , layer: node ? node.json.layer : 0
                , quantity: node ? node.json.quantity : 1
                , state: state
            }
        } as Node;
    }

    static outputNode (node: Node) {
        const source = node.data.src;

        const newNode = {
            id: source.id
            , id_object: source.id_object
            , reference: source.reference
            , type: node.type??'default'
            , uuid: node.id
            , layer: node.data.layer
            , position: node.position
            , ancestors: node.data.ancestors
        } as NodeInterface;

        return FlowParser.parseOutput(newNode);
    }


    /* Specific */
    static outputRoute (node: Node) {
        const source = node.data.src;
        const task = node.data.state.task.json;

        const newRoute = {
            id: source.id
            , id_tag: source.id_object
            , id_task: task.id
            , quantity: node.data.quantity
        } as RouteInterface;

        return FlowParser.parseOutput(newRoute);
    }
}