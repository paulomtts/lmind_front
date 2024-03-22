/* Base interfaces */
interface NodeInterface {
    id?: number;
    id_object: number | null;
    reference: string | null;
    type: string;
    uuid: string;
    layer: number;
    position: { x: number, y: number };
    ancestors: string[];
}

interface EdgeInterface {
    id?: number | string;
    id_object: number | string;
    reference: string;
    source_uuid: string;
    target_uuid: string;
    type: string;
}

/* Custom interfaces */
interface RouteInterface {
    id?: number | null;
    id_tag: number | null;
    id_task: number;
    id_node: number;
    quantity: number;
}

export { EdgeInterface, NodeInterface, RouteInterface }