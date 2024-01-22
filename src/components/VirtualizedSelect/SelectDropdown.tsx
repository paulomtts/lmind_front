import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


export default function SelectDropdown({
    value
    , placeholder = "Click to open..."
    , isInvalid = false
    , onClick = () => {}
    , children
}: {
    value?: string
    , placeholder?: string
    , isInvalid?: boolean
    , onClick?: () => void
    , children: React.ReactNode
}) {

    return (
    <div>
        <div 
            className={`
                flex items-center justify-between
                px-2 py-1.6
                cursor-pointer
                hover:bg-slate-50
                active:bg-slate-100
                
                ${isInvalid ? 'border-2 border-required' : 'border border-slate-400'} rounded-md
            `}
            onClick={onClick}
        >
            {!!value ? <p className="ml-2">{value}</p> : <p className="ml-2 text-slate-400">{placeholder}</p>}

            <FontAwesomeIcon icon={faChevronDown}/>
        </div>

        {children}

    </div>
    )
}