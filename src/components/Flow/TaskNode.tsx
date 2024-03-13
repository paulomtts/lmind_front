import React from "react";
import {
    Handle
    , Position
} from 'reactflow';
import { Button, Switch } from "@chakra-ui/react";
import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import VSelect from "../VirtualizedSelect/VirtualizedSelect";
import { DataRow, DataField } from "../../providers/data/models"
import { useFlow } from "./Flow";


export default function TaskNode({
    id
    , data
    , selected
}: {
    id: string;
    data: Record<string, any>;
    selected: boolean;
}) {

    const { task } = data.state;
    const { onStateChange, addChild, removeNode } = useFlow();

    const [row, setRow] = React.useState<DataRow>(task);

    
    /* Handlers */
    const handleOptionClick = (labelOption: DataField, _: DataField, row: DataRow) => {
        row.getField(labelOption.name).props.data = task.getField(labelOption.name).props.data;
        setRow(row);
        onStateChange(id, {...data.state, task: row});
    }


    return (
        <div className={`
            w-72
            bg-white 
            border-1 border-gray-300 rounded-md shadow-lg

            ${selected ? "ring-2 ring-teal-500 border-transparent" : ""}
        `}>       
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 rounded-none bg-gray-500"
                isValidConnection={ (connection) => connection.source !== id }
            />
            {row &&
            <div className="flex flex-col">
                <div className="
                    p-2 rounded-t-md 
                    bg-gradient-to-r from-slate-400 via-teal-600 to-slate-400
                ">
                    <VSelect 
                        field={task.getField('name')} 
                        data={task.getField('name').props.data} 
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

                    <div className="flex justify-center gap-2">
                        <Button
                            colorScheme="teal"
                            size="xs"
                            variant="outline"
                            title="Click to add a child"
                            onClick={() => addChild(id)}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                        </Button>

                        {/* {node.getField('layer').value > 0 && */}
                        <Button
                            colorScheme="red"
                            size="xs"
                            variant="outline"
                            title="Click to add a child"
                            onClick={() => removeNode(id)}
                        >
                            <FontAwesomeIcon icon={faRemove} />
                        </Button>
                        {/* } */}
                    </div>
                </div>
            </div>}
    
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 bg-gray-500"
                isValidConnection={ (connection) => connection.target !== id }
            />
        </div>
    )
}