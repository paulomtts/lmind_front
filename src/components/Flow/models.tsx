import { v4 } from "uuid";
import { DataRow } from "../../providers/data/models";
import { TSysNodeInterface } from "./interfaces";


export class NodeObject {
    id: string;
    position: { x: number, y: number };
    type: string;
    data: {
        node: DataRow
        , state: Record<string, DataRow>
        , methods: {
            onStateChange?: (id: string, state: Record<string, DataRow>) => void // reason: dependency injection for state change
            , insertNode?: (node: NodeObject, parents: NodeObject[], children: NodeObject[]) => void // reason: dependency injection for adding child nodes
            , addChild?: () => void // reason: used by the TaskNode component to add a child node
        }
    };

    constructor(
        type: string
        , state: Record<string, DataRow>
        , nodeJson: TSysNodeInterface = { 
            id_object: undefined
            , reference: undefined
            , type: undefined
            , uuid: v4() 
        }
        , uuid: string = v4()
        , position: { x: number, y: number } = { x: 0, y: 0 }
    ) {
        this.id = uuid;
        this.position = position;
        this.type = type;

        const newNode = new DataRow('tsys_nodes', {...nodeJson});
        this.data = { node: newNode, state: {...state}, methods: {}};

        this.data.methods.addChild = this.addChild;
    }

    addChild = () => {
        if (!this.data.methods.insertNode) throw new Error('Nodebjects not initialized within Flow component cannot create children.');

        const newNodeJson = {
            id_object: this.data.node.json.id_object
            , reference: this.data.node.json.reference
            , type: this.data.node.json.type
            , uuid: v4()
        } as TSysNodeInterface;

        const newChild = new NodeObject(
            String(this.type),
            this.data.state,
            newNodeJson
        );

        newChild.data.methods = {
            insertNode: this.data.methods.insertNode,
            onStateChange: this.data.methods.onStateChange,
            addChild: newChild.data.methods.addChild?.bind(newChild)
        };
        
        this.data.methods.insertNode(newChild, [this], []);
    }
}