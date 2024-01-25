import React from "react";

import { DataField, DataRow } from "../../providers/data/models";

export default function SelectOption({
    valueOption
    , labelOption
    , className = ''
    , children
    , onClick = () => { }
}: {
    valueOption: DataField | undefined
    , labelOption: DataField | undefined
    , className?: string
    , children?: React.ReactNode
    , onClick?: (labelOption: DataField, valueOption: DataField) => void
}) {

    if (!valueOption) {
        return (<>
            <div className={`flex flex-row items-center justify-start w-full h-8 px-2`}>
                No options found.
            </div>
        </>);
    }

    return (<>
        <div className={`flex flex-row items-center justify-start w-full h-8 px-2 hover:bg-slate-100 ${className}`} onClick={() => valueOption && labelOption && onClick(labelOption, valueOption)}>
            {children}
        </div>
    </>);
}