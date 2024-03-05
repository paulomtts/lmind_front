import React from "react";

import Flow from "../../components/Flow/Flow";
import { DataRow } from "../../providers/data/models";

interface NodeObject {
    type: string;
    state: DataRow;
}

export default function RoutesTab({

}: {

}) {

    const a = new DataRow('tsys_nodes', {
        id_object: 1
        , reference: 'tprod_producttags'
        , type: 'task'
        , uuid: 'a'
        , layer: 1
        , quantity: 1
    });
    
    const b = new DataRow('tsys_nodes', {
        id_object: 1
        , reference: 'tprod_producttags'
        , type: 'task'
        , uuid: 'b'
        , layer: 1
        , quantity: 1
    }); 

    const e = new DataRow('tsys_edges', {
        id_object: 1
        , reference: 'tprod_producttags'
        , type: 'task'
        , source_uuid: 'a'
        , target_uuid: 'b'
    });
    return (<>
        <Flow nodes={[a, b]} edges={[e]}/>
    </>);
}