import React, { ChangeEvent, useState, useRef } from 'react';
import {
    Input,
    Button,
    Switch,

    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,

} from '@chakra-ui/react'

import { DataField, DataRow } from '../../providers/data/dataModels';
import ConfirmationPopover from '../ConfirmationPopover/ConfirmationPopover';


export default function BasicForm({
    state
    , mode = 'create'
    , onChange = () => {}
    , onSaveClick = () => {}
    , onDeleteClick = () => {}
}: { 
    state: DataRow
    , mode?: 'create' | 'update'
    , onChange?: (state: DataRow) => void
    , onSaveClick?: () => void
    , onDeleteClick?: () => void
}) {

    const [formState, setFormState] = useState(state);
    const isInvalid = useRef(false);


    /* Methods */
    const _changeState = (name: string, value: any) => {
        const newFormState = new DataRow(formState.tableName, formState.json);

        newFormState.setFieldValue(name, value);

        setFormState(newFormState);
        onChange(newFormState);
    }


    /* Handlers */
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>, field: DataField) => {
        if (field.type === 'number' && isNaN(Number(e.target.value))) {
            return;
        }

        const value = e.target.value;
        _changeState(field.name, value);
    };

    const handleStep = (field: DataField, operation: string, stepVal: number = 1) => {
        const step = operation === 'sum' ? stepVal : -stepVal;
        if(field.props.max && Number(field.value) + step > field.props.max) return;
        if(field.props.min && Number(field.value) + step < field.props.min) return;
        const value = Number(formState.json[field.name]) + step
        _changeState(field.name, value);
    }

    const handleOnKeyDown = (e: React.KeyboardEvent, field: DataField) => {
        if (e.ctrlKey && e.key === 'ArrowUp') {
            handleStep(field, 'sum', 10);
        } else if (e.ctrlKey && e.key === 'ArrowDown') {
            handleStep(field, 'sub', 10);
        } else if (e.key === 'ArrowUp') {
            handleStep(field, 'sum');
        } else if (e.key === 'ArrowDown') {
            handleStep(field, 'sub');
        } 
    }
    

    const fieldComponents = formState.fields.map((field: DataField, index: number) => {
        const identifier = `APIForm-field-${field.label}-${index}`;
        const value = String(field.value);

        let newIsInvalid = false;

        if (!field.visible) {
            return null;
        }

        if (field.props && mode === 'create' && field.props.crud?.visible.create === false) {
            return null;
        }

        switch (field.type) {
            case 'text' || 'password' || 'email':
                newIsInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <Input 
                            type={field.type} 
                            value={value}
                            minLength={field.props.minLength}
                            maxLength={field.props.maxLength}
                            placeholder='Type...' 
                            isDisabled={!field.editable}
                            onChange={(e) => handleFieldChange(e, field)}
                        />

                        <FormErrorMessage>{field.message}</FormErrorMessage>
                    </FormControl>
                );
                case 'number':
                    newIsInvalid = ((field.required && field.value === '') || Number(value) < field.props.min || Number(value) > field.props.max);

                    return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <NumberInput value={value} min={field.props.min} isDisabled={!field.editable}>
                            <NumberInputField onChange={(e) => handleFieldChange(e, field)} onKeyDown={(e) => handleOnKeyDown(e, field)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleStep(field, 'sum')} />
                                <NumberDecrementStepper onClick={() => handleStep(field, 'sub')} />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>Hold down CTRL + Arrow Up/Down to modify in increments of 10</FormHelperText>
                        <FormErrorMessage>{field.message}</FormErrorMessage>
                    </FormControl>
                );
            case 'boolean':
                newIsInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label[0].toUpperCase() + field.label.slice(1)}</FormLabel>
                        <Switch 
                            isChecked={Boolean(value)} 
                            onChange={(e) => handleFieldChange(e, field)}
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

        isInvalid.current = newIsInvalid;
    });

    const modalFooterCreateMode = <Button colorScheme="blue" onClick={onSaveClick}>Save</Button>;

    const modalFooterEditMode = <>
        <ConfirmationPopover onYes={onDeleteClick}>
            <Button colorScheme="red" variant='outline'>Delete</Button>
        </ConfirmationPopover>
        <Button colorScheme="blue" onClick={onSaveClick}>Save</Button>
    </>

    return (<div className='flex flex-col gap-4'>
        {fieldComponents}

        <div className={`flex ${mode === 'create' ? 'justify-end' : 'justify-between'}`}>
            {mode === 'create' ? modalFooterCreateMode : modalFooterEditMode}
        </div>
    </div>);
}