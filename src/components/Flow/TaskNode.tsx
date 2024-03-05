import React from "react";
import {
    Handle
    , Position
} from 'reactflow';

import VirtualizedSelect from "../VirtualizedSelect/VirtualizedSelect";
import { DataRow, DataObject } from "../../providers/data/models";
import { CRUD } from "../../providers/data/routes/CRUD";


export default function TaskNode({
    id
    , data
}: {
    id: string;
    data: DataRow;
}) {
    const row = new DataRow('tprod_tasks')
    row.setValue(row.getField('name'), 'abc')
    const [state, setState] = React.useState<DataRow>(row);

    React.useEffect(() => {
        retrieveTasksData();
    }, []);
    
    const retrieveTasksData = async () => {
        const { response, data } = await CRUD.select('tprod_tasks', {notification: false});

        if (response.ok) {
            const field = state.getField('name');
            field.props.data = data;
            setState(state);
        }
    }

    return (
        <div className="
            w-72 p-2
            bg-white 
            border-1 border-slate-400 rounded-md shadow-lg 
        ">       
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2"
                isValidConnection={ (connection) => connection.source !== id }
            />

            <div className="flex flex-col items-center gap-2">
                <VirtualizedSelect 
                    field={state.getField('name')} 
                    data={state.getField('name').props.data} 
                />
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