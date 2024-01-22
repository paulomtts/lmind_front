import React from "react";
import { v4 } from "uuid";

import SelectOption from "./SelectOption";
import { useVirtualizedList } from "../../hooks/useVirtualizedList";
import { DataField, DataObject, DataRow } from "../../providers/data/dataModels";


export default function SelectBox({
    data
    , fieldName
    , currRow
    , children
    , handleOptionClick = () => {}
}: {
    data: DataObject
    fieldName: string
    currRow: DataRow | undefined
    children: React.ReactNode
    handleOptionClick?: (row: DataRow, field: DataField) => void
}) {

    const containerRef = React.useRef<HTMLDivElement>(null);


    /* Builders */
    const rowBuilder = (row: DataRow) => {
        const uuid = v4();
        
        return (
            <SelectOption
                key={`option-${uuid}`}
                className={`${row.getFieldObject(fieldName)?.value === currRow?.getFieldObject(fieldName)?.value ? 'bg-slate-300' : ''}`}
                data={row}
                field={row.getFieldObject(fieldName)}
                onClick={handleOptionClick}
            >
                <p className="text-sm font-normal text-slate-800">
                    {String(row.getFieldObject(fieldName)?.value ?? '')}
                </p>
            </SelectOption>
        );
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data.rows, rowBuilder, () => true, containerRef, [currRow], 32, 10, 5);

    return (
    <div 
        className={`
            absolute z-50 max-h-36
            overflow-x-hidden overflow-auto
            bg-white rounded border border-slate-300
            select-none
        `}
        style={{
            width: '100%'
        }}
        ref={containerRef}
    >            
        {children}
        
        <div key={`option-prev`} style={{height: `${prevHeight}px`}} />
        {visibleData}
        <div key={`option-post`} style={{height: `${postHeight}px`}} />
    </div>
    );
}