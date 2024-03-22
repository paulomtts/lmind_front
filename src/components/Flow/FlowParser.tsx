import { Node, Edge } from "reactflow";
import { DataRow } from "../../providers/data/models";
import { v4 } from "uuid";
import { EdgeInterface, NodeInterface, RouteInterface } from "./interfaces";

export class FlowParser {

    static parseOutput(object: any) {
        Object.keys(object).forEach(key => {
            if (object[key] === '') {
                delete object[key];
            }
        });
        
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

    static inputNode (type: string, nodeJson: Record<string, any> | null = null, state: Record<string, DataRow>) {
        const uuid = nodeJson?.uuid??v4()
        
        return {
            id: uuid
            , type: type
            , position: nodeJson?.position??{ x: 0, y: 0 }
            , data: {
                src: {
                    id: nodeJson ? nodeJson.id : ''
                    , id_object: nodeJson ? nodeJson.id_object : ''
                    , reference: nodeJson ? nodeJson.reference : ''
                } // reason: avoid each node holding a big data structure
                , ancestors: nodeJson ? nodeJson.ancestors : []
                , layer: nodeJson ? nodeJson.layer : 0
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
}