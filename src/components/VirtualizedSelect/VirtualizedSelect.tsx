import React from "react";

import SelectDropdown from "./SelectDropdown";
import SelectSearch from "./SelectSearch";
import SelectBox from "./SelectBox";
import { DataObject, DataField, DataRow } from "../../providers/data/models";


export default function VSelect({
    field
    , data
    , width = 0
    , showInvalid = true
    , disabled = false
    , onOptionClick = () => { }
    , onBlur = () => { }
}: {
    field: DataField
    data: DataObject
    width?: number
    showInvalid?: boolean
    disabled?: boolean
    onOptionClick?: (field: DataField, option: DataField, row: DataRow) => void
    onBlur?: () => void
}) {

    const componentRef = React.useRef<HTMLDivElement>(null);

    const [compData, setCompData] = React.useState<DataObject>(data);
    
    const [label, setLabel] = React.useState<string>(String(field.value));
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
            const fieldValue = row[field.props.labelName];
            
            if (!fieldValue) return false;
            if (!String(fieldValue).toLowerCase().includes(value.toLowerCase())) return false;

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

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const firstLabel = compData.rows[0].getField(field.props.labelName);
            const firstValue = compData.rows[0].getField(field.props.valueName);

            if (!firstLabel || !firstValue) return;

            const row = compData.rows.find((row) => {
                return row.getField(field.props.labelName)?.value === firstLabel.value
                    && row.getField(field.props.valueName)?.value === firstValue.value;
            });
            handleOptionClick(firstLabel, firstValue, row!);
        }
    }
    
    const handleOptionClick = (labelOption: DataField, valueOption: DataField, row: DataRow) => {
        setCompData(data);
        setLabel(String(labelOption.value));

        setInputValue('');
        setIsOpen(false);

        onOptionClick(field, valueOption, row);
    }

    return (<div ref={componentRef} className="w-full">
    <SelectDropdown
        value={label}
        isInvalid={field.required && !field.value && showInvalid}
        disabled={disabled}
        onClick={handleButtonClick}
        onBlur={onBlur}
    >
        {<div className={`flex flex-col absolute z-50 rounded-md`}
            style={{
                width: `${componentRef.current && componentRef.current.getBoundingClientRect().width}px`
            }}
        >
            {isOpen && <SelectBox fixedWidth={width} field={field} data={compData} handleOptionClick={handleOptionClick}>
                <SelectSearch
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyPress}
                />
            </SelectBox>}
        </div>}
    </SelectDropdown>
    </div>);
}