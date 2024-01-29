import React from "react";

import { DataField } from "../../providers/data/models";

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


    /* Handlers */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter') {
            onClick(labelOption!, valueOption!);
        }

        if (e.key === 'ArrowDown') {
            const nextSibling = e.currentTarget.nextSibling as HTMLButtonElement;
            nextSibling.focus();
        }

        if (e.key === 'ArrowUp') {
            const previousSibling = e.currentTarget.previousSibling as HTMLButtonElement;
            previousSibling.focus();
        }
    }


    if (!valueOption) {
        return (<>
            <div className={`flex flex-row items-center justify-start w-full h-8 px-2`}>
                No options found.
            </div>
        </>);
    }

    return (<>
        <button 
            className={`
                flex flex-row items-center justify-start 
                w-full h-8 px-2 
                hover:bg-slate-100 
                ${className}
            `} 
            onClick={() => valueOption && labelOption && onClick(labelOption, valueOption)}
            onKeyDown={handleKeyDown}
        >
            {children}
        </button>
    </>);
}