import React, { ChangeEvent, useState } from 'react';
import {
    Input,
    Switch,

    FormControl,
    FormLabel,
    
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,

} from '@chakra-ui/react'

import { DataField, DataRow } from '../../providers/data/dataModels';


export default function BasicForm({
    row
    , onChange = () => {}
}: { 
    row: DataRow
    , onChange?: (state: DataRow) => void
}) {

    const [formState, setFormState] = useState(row);


    /* Methods */
    const _changeState = (name: string, value: any) => {
        const newFormState = new DataRow(formState.tableName, formState.json);

        newFormState.json[name] = value;
        newFormState.fields.forEach((field) => {
            if (field.name === name) {
                field.value = value;
            }
        });
        console.log(newFormState)
        setFormState(newFormState);
        onChange(newFormState);
    }


    /* Handlers */
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const value = e.target.value;
        _changeState(name, value);
    };

    const handleIncrement = (name: string) => {   
        const value = Number(formState.json[name]) + 1;
        _changeState(name, value);
    }

    const handleDecrement = (name: string) => {
        const value = Number(formState.json[name]) - 1;
        _changeState(name, value);
    }

    const handleOnKeyDown = (e: React.KeyboardEvent, label: string) => {
        if (e.key === 'ArrowUp') {
            handleIncrement(label);
        }
        else if (e.key === 'ArrowDown') {
            handleDecrement(label);
        }
    }
    

    const fieldComponents = formState.fields.map((field: DataField, index: number) => {
        const identifier = `APIForm-field-${field.label}-${index}`;
        const value = String(field.value);

        if (!field.visible) {
            return null;
        }

        switch (field.type) {
            case 'text' || 'password' || 'email':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <Input 
                            type={field.type} 
                            value={value} 
                            placeholder='Type...' 
                            isDisabled={!field.editable}
                            onChange={(e) => handleFieldChange(e, field.name)}
                        />
                    </FormControl>
                );
            case 'number':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <NumberInput value={value} isDisabled={!field.editable}>
                            <NumberInputField onChange={(e) => handleFieldChange(e, field.name)} onKeyDown={(e) => handleOnKeyDown(e, field.name)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleIncrement(field.name)} />
                                <NumberDecrementStepper onClick={() => handleDecrement(field.name)} />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                );
            case 'boolean':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <Switch 
                            isChecked={Boolean(value)} 
                            onChange={(e) => handleFieldChange(e, field.name)}
                        />
                    </FormControl>
                );
            // case 'select':
            //     return (
            //         <FormControl id={identifier} key={identifier} isRequired={field.required}>
            //             <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
            //             <Input 
            //                 type={field.type} 
            //                 value={value} 
            //                 placeholder='Type...' 
            //                 onChange={(e) => handleFieldChange(e, field.name)} 
            //             />
            //         </FormControl>
            //     );
        }
    });

    return (<div className='flex flex-col gap-4'>
        {fieldComponents}
    </div>);
}