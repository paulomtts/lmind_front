import React from "react";
import { Collapse } from '@chakra-ui/react'

import FormFieldWrapper from "../FormFieldWrapper/FormFieldWrapper";
import SelectDropdown from "./SelectDropdown";
import SelectSearch from "./SelectSearch";
import SelectBox from "./SelectBox";
import { DataObject, DataRow, DataField } from "../../providers/data/dataModels";


export default function VirtualizedSelect({
    data
    , fieldName
    , label = ''
    , required
    , errorMessage
    , helperMessage = ''
    , initialRow
    , initialField
    , onOptionClick = () => { }
}: {
    data: DataObject
    fieldName: string
    label?: string
    required?: boolean
    errorMessage?: string
    helperMessage?: string
    initialRow?: DataRow
    initialField?: DataField
    onOptionClick?: (data: DataRow | undefined, field: DataField | undefined) => void
}) {

    const componentRef = React.useRef<HTMLDivElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [compData, setCompData] = React.useState<DataObject>(data);
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [currRow, setCurrRow] = React.useState<DataRow | undefined>(initialRow);
    const [currField, setCurrField] = React.useState<DataField | undefined>(initialField);


    /* Effects */
    React.useEffect(() => {
        setCompData(data);
    }, [data, isOpen]);

    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            
            if (!componentRef.current) return;

            const { left, top, right, bottom } = (componentRef.current as HTMLElement).getBoundingClientRect();            

            if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
                setIsOpen(false);
            }            
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        }
    }, [componentRef]);


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
    const handleButtonClick = () => {
        setIsOpen(!isOpen);

        if (!isOpen) {
            setInputValue('');
            setCompData(data);
        }
    }

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
        filterData(e.target.value);
    }
    
    const handleOptionClick = (row: DataRow, field: DataField) => {
        setInputValue('');
        setCurrRow(row);
        setCurrField(field);
        
        setIsOpen(false);
        setCompData(data);

        onOptionClick(row, field);
    }


    return (<div ref={componentRef}>
    <FormFieldWrapper
        label={label}
        required={required}
        errorMessage={errorMessage}
        helperMessage={helperMessage}
        currField={currField}
    >
        <SelectDropdown
            value={currField ? String(currField.value) : ''}
            isInvalid={!currField?.required && !currField?.value}
            onClick={handleButtonClick}
        >
            {<div 
                className={`
                    flex flex-col
                    absolute z-50 
                    rounded-md
                `}
                style={{
                    width: `${componentRef.current && componentRef.current.getBoundingClientRect().width}px`
                }}
            
            >
                {isOpen &&
                <div>

                    <SelectBox
                        data={compData} 
                        currRow={currRow}
                        fieldName={fieldName}
                        handleOptionClick={handleOptionClick} 
                    >
                        <SelectSearch
                            inputValue={inputValue}
                            handleInputChange={handleInputChange}
                        />
                    </SelectBox>
                </div>}
            </div>}
        </SelectDropdown>


    </FormFieldWrapper>
    </div>);
}