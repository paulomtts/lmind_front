interface EdgeInterface {
    id: string;
    source: string;
    target: string;
}


interface TSysNodeInterface {
    id_object?: number | undefined;
    reference?: string | undefined;
    type?: string | undefined;
    uuid: string;
}

export { EdgeInterface, TSysNodeInterface };