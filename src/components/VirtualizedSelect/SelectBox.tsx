import React from "react";
import { 
    Collapse
} from '@chakra-ui/react'
import { v4 } from "uuid";

import SelectOption from "./SelectOption";
import { useVirtualizedList } from "../../hooks/useVirtualizedList";
import { DataField, DataObject, DataRow } from "../../providers/data/dataModels";


export default function SelectBox({
    data
    , fieldName
    , isOpen
    , currRow
    , parentRef
    , hasLabel = false
    , handleOptionClick = () => {}
}: {
    data: DataObject
    fieldName: string
    isOpen: boolean
    currRow: DataRow | undefined
    parentRef: React.RefObject<HTMLDivElement>
    hasLabel?: boolean
    handleOptionClick?: (row: DataRow, field: DataField) => void
}) {

    const containerRef = React.useRef<HTMLDivElement>(null);


    /* Builders */
    const rowBuilder = (row: DataRow) => {
        const uuid = v4();
        
        return (
            <SelectOption
                key={`option-${uuid}`}
                className={`${row === currRow ? 'bg-slate-300' : ''}`}
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
    ] = useVirtualizedList(data.rows, rowBuilder, () => true, containerRef, [data, currRow], 32, 5, 5);

    return (
    <Collapse in={isOpen}>
        <div 
            className={`
                fixed z-50 max-h-32
                ${hasLabel && !currRow? '-translate-y-6' : ''}
                overflow-x-hidden overflow-auto
                bg-white rounded border border-slate-300
                select-none
            `}
            ref={containerRef}
            style={{width: parentRef.current?.clientWidth}}
        >
            <div key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <div key={`option-post`} style={{height: `${postHeight}px`}} />
        </div>
    </Collapse>
    );
}