import React from "react";
import {
    Handle
    , Position
} from 'reactflow';

export default function TaskNode({
    id
    , data
}: {
    id: string;
    data: {
        label: string;
    }
}) {
    return (
        <div className="
            p-2 
            bg-white 
            border-1 border-slate-400 rounded-md shadow-lg 
        ">
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2"
                isValidConnection={ (connection) => connection.source !== id }
            />

            <div className="flex items-center gap-2">
                {data.label}
                <input className="border-2 rounded-md p-1 text-xs"></input>
            
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                isValidConnection={ (connection) => connection.target !== id }
                className="w-2 h-2 rounded-none"
            />
        </div>
    )
}