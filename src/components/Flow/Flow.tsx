import React from "react";

import { FlowProvider } from "../../providers/FlowProvider";
import EncasedFlow from "./EncasedFlow";
import { DataRow } from "../../providers/data/models";


export default function Flow({
    nodes
    , edges
}: {
    nodes: DataRow[]
    , edges: DataRow[]
}) {

    return (<FlowProvider>
        <EncasedFlow nodesData={nodes} edgesData={edges}/>
    </FlowProvider>);
}