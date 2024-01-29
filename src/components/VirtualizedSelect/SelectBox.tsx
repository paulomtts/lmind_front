import React from "react";
import { v4 } from "uuid";

import SelectOption from "./SelectOption";
import HoverCard, { DataRowTable } from "../HoverCard/HoverCard";
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
    const scrollableRef = React.useRef<HTMLDivElement>(null);

    
    /* Builders */
    const rowBuilder = (row: DataRow) => {
        const uuid = v4();
        
        const labelOption = row.getFieldObject(field.props.labelName);
        const valueOption = row.getFieldObject(field.props.valueName);

        return (
            <HoverCard 
                key={`option-${uuid}`}
                scrollableContainerRef={scrollableRef}
                className="rounded-md bg-white border border-gray-300 shadow-md"
                content={
                    <DataRowTable row={row} />
                }
            >
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
            </HoverCard>

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
            ref={scrollableRef}
            className="max-h-24 overflow-y-auto select-none"
        >
            <div key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <div key={`option-post`} style={{height: `${postHeight}px`}} />
        </div>
    </div>
    );
}