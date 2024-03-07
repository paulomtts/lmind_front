import React from "react";
import {
    Handle
    , Position
} from 'reactflow';
import { Button, Switch } from "@chakra-ui/react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import VSelect from "../VirtualizedSelect/VirtualizedSelect";
import { DataRow, DataField } from "../../providers/data/models";


export default function TaskNode({
    id
    , data
}: {
    id: string;
    data: {
        state: Record<string, DataRow>;
        methods: {
            onStateChange: (id: string, state: Record<string, DataRow>) => void;
            addChild: () => void;
        }
    
    }
}) {

    const { state } = data;
    const { onStateChange, addChild } = data.methods;

    const [row, setRow] = React.useState<DataRow>(state.tasks);

    const handleOptionClick = (_: DataField, __: DataField, row: DataRow) => {
        setRow(row);
        onStateChange(id, {...state, tasks: row});
    }


    return (
        <div className="
            w-72
            bg-white 
            border-1 border-gray-300 rounded-md shadow-lg

            active:ring-2 active:ring-teal-500 active:border-transparent
            focus:ring-2 focus:ring-teal-500 focus:border-transparent
            
        ">       
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2"
                isValidConnection={ (connection) => connection.source !== id }
            />

            <div className="flex flex-col">
                <div className="
                    p-2 rounded-t-md 
                    bg-gradient-to-r from-slate-400 via-teal-600 to-slate-400
                ">
                    <VSelect 
                        field={state.tasks.getField('name')} 
                        data={state.tasks.getField('name').props.data} 
                        width={270}
                        showInvalid={false}
                        onOptionClick={handleOptionClick}
                    />
                </div>

                <div className="flex flex-col gap-2 p-2">

                    {Number(row.getField('id').value) > 0 && <div className="flex flex-col gap-2 p-2">
                        <p className="text-sm font-light line-clamp-5 mb-2">
                            {String(row.getField('description').value).trim()}
                        </p>

                        
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>
                                {String(row.getField('duration').value).trim()} {String(row.getField('unit').value).trim()} <span>({String(row.getField('error_margin').value).trim()}%)</span>
                            </span>

                            <div className="flex gap-2 items-center">

                                <span className="pb-1 ">Interruptible?</span>
                                <Switch 
                                    id="interruptible"
                                    colorScheme="teal"
                                    isChecked={String(row.getField('interruptible').value).trim() === 'true' ? true : false}
                                    size={'sm'}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between font-light" style={{ fontSize: '10px'}}>
                            <div className="flex flex-col">
                                <span>Created by {String(row.getField('created_by').value).trim()}</span>
                                <span>at {String(row.getField('created_at').value).trim()}</span>
                            </div>

                            <div className="flex flex-col">
                                <span>Updated by {String(row.getField('updated_by').value).trim()}</span>
                                <span>at {String(row.getField('updated_at').value).trim()}</span>
                            </div>
                        </div>

                    </div>}

                    <div className="flex justify-center">
                        <Button
                            colorScheme="teal"
                            size="xs"
                            variant="outline"
                            title="Click to add a child"
                            onClick={addChild}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                        </Button>
                        </div>
                        </div>
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