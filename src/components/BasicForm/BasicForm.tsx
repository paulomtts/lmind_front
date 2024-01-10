import React, { ChangeEvent, useState } from 'react';
import {
    Input,

    FormControl,
    FormLabel,
    
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,

} from '@chakra-ui/react'

import { FormField } from './models';


export default function BasicForm({
    fields
    , onChange = () => {}
}: { 
    fields: FormField[] 
    , onChange?: (state: FormField[]) => void
}) {

    const [formState, setFormState] = useState(fields);

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const value = e.target.value;
    
        const newFormState = formState.map((field: FormField) => {
            if (field.label === name) { 
                field.value = value;
            }
            return field;
        });

        setFormState(newFormState);
        onChange(newFormState);
    };

    const handleIncrement = (name: string) => {
        const newFormState = formState.map((field: FormField) => {
            if (field.label === name) { 
                field.value = Number(field.value) + 1;
            }
            return field;
        });
    
        setFormState(newFormState);
        onChange(newFormState);
    }

    const handleDecrement = (name: string) => {
        const newFormState = formState.map((field: FormField) => {
            if (field.label === name) { 
                field.value = Number(field.value) - 1;
            }
            return field;
        });
    
        setFormState(newFormState);
        onChange(newFormState);
    }

    const handleOnKeyDown = (e: React.KeyboardEvent, label: string) => {
        if (e.key === 'ArrowUp') {
            handleIncrement(label);
        }
        else if (e.key === 'ArrowDown') {
            handleDecrement(label);
        }
    }
    

    const fieldComponents = formState.map((field: FormField, index: number) => {
        const identifier = `APIForm-field-${field.label}-${index}`;
        const value = String(field.value);

        switch (field.type) {
            case 'text' || 'password' || 'email':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <Input 
                            type={field.type} 
                            value={value} 
                            placeholder='Type...' 
                            onChange={(e) => handleFieldChange(e, field.label)} 
                        />
                    </FormControl>
                );
            case 'number':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <NumberInput value={value}>
                            <NumberInputField onChange={(e) => handleFieldChange(e, field.label)} onKeyDown={(e) => handleOnKeyDown(e, field.label)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleIncrement(field.label)} />
                                <NumberDecrementStepper onClick={() => handleDecrement(field.label)} />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                );
        }
    });

    return (<div className='flex flex-col gap-4'>
        {fieldComponents}
    </div>);
}