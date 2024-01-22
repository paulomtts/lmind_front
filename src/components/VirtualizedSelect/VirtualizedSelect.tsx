import React from "react";

import BasicInput from "../BasicInput/BasicInput";
import SelectBox from "./SelectBox";
import { DataObject, DataRow, DataField } from "../../providers/data/dataModels";


export default function VirtualizedSelect({
    data
    , fieldName
    , label = ''
    , required
    , errorMessage
    , initialRow
    , initialField
    , onOptionClick = () => { }
    , onClearClick = () => { }
}: {
    data: DataObject
    fieldName: string
    label?: string
    required?: boolean
    errorMessage?: string
    initialRow?: DataRow
    initialField?: DataField
    onOptionClick?: (data: DataRow | undefined, field: DataField | undefined) => void
    onClearClick?: () => void
}) {

    const parentRef = React.useRef<HTMLDivElement>(null);

    const [compData, setCompData] = React.useState<DataObject>(data);
    const [isOpen, setIsOpen] = React.useState(false);
    const [currRow, setCurrRow] = React.useState<DataRow | undefined>(initialRow);
    const [currField, setCurrField] = React.useState<DataField | undefined>(initialField);


    /* Effects */
    React.useEffect(() => {
        setCompData(data);
    }, [data, isOpen]);


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
        const newJson = data.json.filter(row => {
            const fieldValue = row[fieldName];
            
            if (!fieldValue) return false;
            if (!String(fieldValue).includes(value)) return false;

            return true
        });

        setCompData(new DataObject(data.tableName, newJson));
    }


    /* Handlers */
    const handleInputFocus = () => {
        setIsOpen(true);
    }

    const handleInputChange = (e: any) => {
        if (e.target.value === '') { 
            setCompData(data);
            setCurrRow(undefined);
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

        onClearClick();
    }

    const handleOptionClick = (row: DataRow, field: DataField) => {
        setCurrRow(row);
        setCurrField(field);
        
        setIsOpen(false);
        setCompData(data);

        onOptionClick(row, field);
    }


    return (<div className="flex flex-col" ref={parentRef}>
            <BasicInput 
                field={currField}
                label={label} 
                required={required} 
                errorMessage={errorMessage} 
                onChange={handleInputChange} 
                onClear={handleInputClear} 
                onFocus={handleInputFocus}
            />
            
            {isOpen && <SelectBox 
                data={compData} 
                fieldName={fieldName}
                isOpen={isOpen}
                currRow={currRow}
                parentRef={parentRef}
                hasLabel={!!label}
                handleOptionClick={handleOptionClick} 
            />}
    </div>);
}