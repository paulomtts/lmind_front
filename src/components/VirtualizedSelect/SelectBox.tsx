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
            <div key={uuid} className={`${row === currRow ? 'bg-slate-300' : ''}`}>
                <SelectOption
                    data={row}
                    field={row.getField(fieldName)}
                    onClick={handleOptionClick}
                >
                    <p className="text-sm font-normal text-slate-800">
                        {String(row.getField(fieldName)?.value ?? '')}
                    </p>
                </SelectOption>
            </div>
        );
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data.rows, rowBuilder, () => true, containerRef, [data, currRow], 32, 5, 5);


    return (
    <Collapse in={isOpen}
        className={`
            fixed z-50 max-h-32
            ${hasLabel ? 'translate-y-18' : 'translate-y-10'}
            overflow-x-hidden
            bg-white rounded border border-slate-300
        `}
    >
        <div 
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