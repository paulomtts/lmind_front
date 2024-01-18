import React from "react";
import { 
    SlideFade
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
    , onClickOption = () => {}
}: {
    data: DataObject
    fieldName: string
    isOpen: boolean
    currRow: DataRow | undefined
    parentRef: React.RefObject<HTMLDivElement>
    onClickOption?: (row: DataRow, field: DataField) => void
}) {

    const rowBuilder = (row: DataRow) => {
        const uuid = v4();
        
        return (
            <div key={uuid} className={`${row === currRow ? 'bg-slate-300' : ''}`}>
                <SelectOption
                    data={row}
                    field={row.getField('name')}
                    onClick={onClickOption}
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
    ] = useVirtualizedList(data.rows, rowBuilder, () => true, parentRef, [data, currRow]);

    return (
    <SlideFade in={isOpen} offsetY='-20px'>
        <div 
            className="
                max-h-32 
                fixed z-10
                overflow-x-hidden
                bg-white rounded border border-slate-300
            "
            style={{width: parentRef.current?.clientWidth}}
        >
            <div key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <div key={`option-post`} style={{height: `${postHeight}px`}} />
        </div>
    </SlideFade>
    );
}