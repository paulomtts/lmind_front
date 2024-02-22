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


        const parent = e.currentTarget.parentElement
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            
            const nextSibling = parent?.nextElementSibling?.nextElementSibling?.firstChild as HTMLButtonElement;
            // const nextSibling = e.currentTarget.nextElementSibling as HTMLButtonElement;

            if (!nextSibling) return;
            nextSibling.focus();
        }
        
        if (e.key === 'ArrowUp') {
            e.preventDefault();

            const prevSibling = parent?.previousElementSibling?.previousElementSibling?.firstChild as HTMLButtonElement;
            // const prevSibling = e.currentTarget.previousElementSibling as HTMLButtonElement;

            if (!prevSibling) return;
            prevSibling.focus();
        }
    }


    if (!valueOption) {
        return (<>
            <div className={`flex flex-row items-center justify-start w-full h-8 px-2`}>
                No options found.
            </div>
        </>);
    }

    return (
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
    );
}