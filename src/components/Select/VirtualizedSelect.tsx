import React from "react";

import BasicInput from "../BasicInput/BasicInput";
import SelectBox from "./SelectBox";
import { DataObject, DataRow, DataField } from "../../providers/data/dataModels";


export default function VirtualizedSelect({
    data
    , fieldName
    , required
    , onOptionClick = () => { }
}: {
    data: DataObject
    fieldName: string
    required?: boolean
    onOptionClick?: (data: DataRow | undefined, field: DataField | undefined) => void
}) {

    const parentRef = React.useRef(null);

    const [compData, setCompData] = React.useState<DataObject>(data); // [data, setData
    const [isOpen, setIsOpen] = React.useState(false);
    const [row, setRow] = React.useState<DataRow | undefined>(undefined);
    const [field, setField] = React.useState<DataField | undefined>(undefined);


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
        if (field) {
            setCompData(data);            
        }
        setIsOpen(!isOpen);
    }

    const handleInputChange = (e: any) => {
        if (e.target.value === '') { 
            setCompData(data);
            setField(undefined);
        } else {
            filterData(e.target.value);
        }
        setIsOpen(true);
    }
    
    const handleInputClear = () => {
        setCompData(data);

        setRow(undefined);
        setField(undefined);

        setIsOpen(false);

        onOptionClick(undefined, undefined);
    }

    const handleOptionClick = (row: DataRow, field: DataField) => {
        setRow(row);
        setField(field);
        setIsOpen(false);

        onOptionClick(row, field);
    }


    return (<div className="flex flex-col" ref={parentRef}>
        {parentRef.current && <>
            <BasicInput field={field} onClick={handleInputClick} onChange={handleInputChange} onClear={handleInputClear} required={required}/>
            {isOpen && <SelectBox data={compData} fieldName={fieldName} isOpen={isOpen} currRow={row} parentRef={parentRef} onClickOption={handleOptionClick} />}
        </>}
    </div>);
}