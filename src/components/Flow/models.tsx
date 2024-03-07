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
            , addChild?: () => NodeObject // reason: used by the TaskNode component to add a child node
        }
        , level: number
    };
    selected: boolean;

    constructor(
        type: string
        , position: { x: number, y: number }
        , level: number
        , state: Record<string, DataRow>
        , nodeJson: TSysNodeInterface = { 
            id_object: undefined
            , reference: undefined
            , type: undefined
            , uuid: v4() 
        }
        , uuid: string = v4()
        , selected: boolean = false
    ) {
        this.id = uuid;
        this.position = position;
        this.type = type;
        this.selected = selected;

        const newNode = new DataRow('tsys_nodes', {...nodeJson});
        this.data = { node: newNode, state: {...state}, methods: {}, level: level};

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

        const type = this.type;
        const newState = {...this.data.state}; // shallow copies keep references in nested objects
        Object.values(newState).forEach((state: DataRow) => {
            newState[type] = new DataRow(state.tableName) // replace top-level object, keeps nested references
        });

        const currPosition = {...this.position};

        const newChild = new NodeObject(
            type
            , { x: currPosition.x, y: currPosition.y + 288 }
            , this.data.level + 1
            , {...newState}
            , newNodeJson
        );

        newChild.data.methods = {
            insertNode: this.data.methods.insertNode,
            onStateChange: this.data.methods.onStateChange,
            addChild: newChild.data.methods.addChild?.bind(newChild)
        };
        
        this.data.methods.insertNode(newChild, [this], []);

        return newChild;
    }
}