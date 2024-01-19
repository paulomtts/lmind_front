import React from "react";

import BasicInput from "../BasicInput/BasicInput";
import SelectBox from "./SelectBox";
import { DataObject, DataRow, DataField } from "../../providers/data/dataModels";


export default function VirtualizedSelect({
    data
    , initialRow
    , initialField
    , fieldName
    , required
    , errorMessage
    , onOptionClick = () => { }
}: {
    data: DataObject
    initialRow?: DataRow
    initialField?: DataField
    fieldName: string
    required?: boolean
    errorMessage?: string
    onOptionClick?: (data: DataRow | undefined, field: DataField | undefined) => void
}) {

    const parentRef = React.useRef<HTMLDivElement>(null);

    const [compData, setCompData] = React.useState<DataObject>(data); // [data, setData
    const [isOpen, setIsOpen] = React.useState(false);
    const [currRow, setCurrRow] = React.useState<DataRow | undefined>(initialRow);
    const [currField, setCurrField] = React.useState<DataField | undefined>(initialField);


    /* Effects */
    React.useEffect(() => {
        setCompData(data);
    }, [data]);


    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            
            if (!parentRef.current) return;

            const { left, top, right, bottom } = (parentRef.current as HTMLElement).getBoundingClientRect();            

            if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
                setIsOpen(false);
            }            
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        }
    }, [parentRef]);


    /* Methods */
    const filterData = (value: string) => {
        const newData = new DataObject(data.tableName, data.json());

        newData.rows = data.rows.filter(row => {
            const field = row.getField(fieldName);
            
            if (!field) return false;
            if (!String(field.value).includes(value)) return false;

            return true
        });

        setCompData(newData);
    }


    /* Handlers */
    const handleInputClick = () => {
        if (currField) {
            setCompData(data);            
        }
        setIsOpen(!isOpen);
    }

    const handleInputChange = (e: any) => {
        if (e.target.value === '') { 
            setCompData(data);
            setCurrField(undefined);
        } else {
            filterData(e.target.value);
        }
    }
    
    const handleInputClear = () => {
        setCompData(data);

        setCurrRow(undefined);
        setCurrField(undefined);

        setIsOpen(false);

        onOptionClick(undefined, undefined);
    }

    const handleOptionClick = (row: DataRow, field: DataField) => {
        setCurrRow(row);
        setCurrField(field);
        setIsOpen(false);

        onOptionClick(row, field);
    }


    return (<div className="flex flex-col" ref={parentRef}>
            <BasicInput field={currField} onClick={handleInputClick} onChange={handleInputChange} onClear={handleInputClear} required={required} errorMessage={errorMessage} />
            
            {isOpen && <SelectBox 
                data={compData} 
                fieldName={fieldName}
                isOpen={isOpen}
                currRow={currRow}
                parentRef={parentRef}
                handleOptionClick={handleOptionClick} 
            />}
    </div>);
}