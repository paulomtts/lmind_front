import React from "react";

import { DataField, DataRow } from "../../providers/data/models";

export default function SelectOption({
    field
    , className = ''
    , children
    , onClick = () => { }
}: {
    field: DataField | undefined
    , className?: string
    , children?: React.ReactNode
    , onClick?: (field: DataField) => void
}) {

    if (!field) {
        return (<>
            <div className={`flex flex-row items-center justify-start w-full h-8 px-2 hover:bg-slate-100 ${className}`}>
                {''}
            </div>
        </>);
    }

    return (<>
        <div className={`flex flex-row items-center justify-start w-full h-8 px-2 hover:bg-slate-100 ${className}`} onClick={() => onClick(field)}>
            {children}
        </div>
    </>);
}