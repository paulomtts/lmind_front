import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


export default function SelectDropdown({
    value
    , placeholder = "Click to open..."
    , isInvalid = false
    , children
    , disabled = false
    , onClick = () => {}
}: {
    value?: string
    , placeholder?: string
    , isInvalid?: boolean
    , children: React.ReactNode
    , disabled?: boolean
    , onClick?: () => void
}) {

    return (
    <div>
        <button 
            className={`
                flex items-center justify-between
                px-2 py-1.6 w-full
                cursor-pointer

                hover:bg-slate-50
                active:bg-slate-100

                disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                disabled:text-slate-400
                disabled:border-slate-100
                
                ${isInvalid ? 'border-2 border-required' : 'border border-slate-400'} rounded-md
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {!!value ? <p className="ml-2">{value}</p> : <p className="ml-2 text-slate-400">{placeholder}</p>}

            <FontAwesomeIcon icon={faChevronDown}/>
        </button>

        {children}

    </div>
    )
}