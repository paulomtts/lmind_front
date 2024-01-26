import React from "react";
import { v4 } from "uuid";

import SelectOption from "./SelectOption";
import { useVirtualizedList } from "../../hooks/useVirtualizedList";
import { DataField, DataObject, DataRow } from "../../providers/data/models";


export default function SelectBox({
    data
    , field
    , children
    , handleOptionClick = () => {}
}: {
    data: DataObject
    field: DataField
    children: React.ReactNode
    handleOptionClick?: (label: DataField, field: DataField) => void
}) {

    const containerRef = React.useRef<HTMLDivElement>(null);


    /* Builders */
    const rowBuilder = (row: DataRow) => {
        const uuid = v4();

        const labelOption = row.getFieldObject(field.props.labelName);
        const valueOption = row.getFieldObject(field.props.valueName);

        
        return (
            <SelectOption
                className={`${labelOption && field.value === labelOption.value ? 'bg-slate-300' : ''}`}
                key={`option-${uuid}`}
                labelOption={labelOption}
                valueOption={valueOption}
                onClick={handleOptionClick}
            >
                <p className="text-sm font-normal text-slate-800">
                    {String(labelOption?.value)}
                </p>
            </SelectOption>
        );
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data.rows, rowBuilder, () => true, containerRef, [], 32, 10, 5);

    return (
    <div 
        className={`absolute z-50 bg-white border rounded border-slate-300`}
        style={{width: '100%'}}
        ref={containerRef}
    >
        {children}
        
        <div
            className="max-h-24 overflow-y-auto select-none"
        >
            <div key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <div key={`option-post`} style={{height: `${postHeight}px`}} />
        </div>
    </div>
    );
}