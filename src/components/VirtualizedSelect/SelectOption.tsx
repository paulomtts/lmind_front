import React from "react";

import { DataField, DataRow } from "../../providers/data/dataModels";

export default function SelectOption({
    data
    , field
    , children
    , onClick = () => { }
}: {
    data: DataRow
    , field: DataField | undefined
    , children?: React.ReactNode
    , onClick?: (data: DataRow, field: DataField) => void
}) {

    if (!field) {
        return (<>
            <div className="flex flex-row items-center justify-start w-full h-8 px-2 hover:bg-slate-100">
                {''}
            </div>
        </>);
    }

    return (<>
        <div className="flex flex-row items-center justify-start w-full h-8 px-2 hover:bg-slate-100" onClick={() => onClick(data, field)}>
            {children}
        </div>
    </>);
}