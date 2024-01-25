import React from "react";

import SelectDropdown from "./SelectDropdown";
import SelectSearch from "./SelectSearch";
import SelectBox from "./SelectBox";
import { DataObject, DataField } from "../../providers/data/models";


export default function VirtualizedSelect({
    field
    , data
    , disabled = false
    , onOptionClick = () => { }
}: {
    field: DataField
    data: DataObject
    disabled?: boolean
    onOptionClick?: (field: DataField, option: DataField) => void
}) {

    const componentRef = React.useRef<HTMLDivElement>(null);

    const [compData, setCompData] = React.useState<DataObject>(data);
    
    const [label, setLabel] = React.useState<string>('');
    const [inputValue, setInputValue] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);


    /* Effects */
    React.useEffect(() => {
        setCompData(data);
    }, [data]);

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
            const fieldValue = row[field.name];
            
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
    
    const handleOptionClick = (labelOption: DataField, valueOption: DataField) => {
        setCompData(data);
        setLabel(String(labelOption.value));

        setInputValue('');
        setIsOpen(false);

        onOptionClick(field, valueOption);
    }

    return (<div ref={componentRef}>
    <SelectDropdown
        value={label}
        isInvalid={field.required && !field.value}
        disabled={disabled}
        onClick={handleButtonClick}
    >
        {<div className={`flex flex-col absolute z-50 rounded-md`}
            style={{
                width: `${componentRef.current && componentRef.current.getBoundingClientRect().width}px`
            }}
        >
            {isOpen && <SelectBox field={field} data={compData} handleOptionClick={handleOptionClick}>
                <SelectSearch
                    inputValue={inputValue}
                    handleInputChange={handleInputChange}
                />
            </SelectBox>}
        </div>}
    </SelectDropdown>
    </div>);
}