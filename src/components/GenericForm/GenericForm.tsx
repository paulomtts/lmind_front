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

import ConfirmationPopover from '../ConfirmationPopover/ConfirmationPopover';
import VirtualizedSelect from '../VirtualizedSelect/VirtualizedSelect';
import { DataField, DataRow } from '../../providers/data/models';


export default function GenericForm({
    state
    , mode = 'create'
    , editable = true
    , onChange = () => {}
    , onSaveClick = () => {}
    , onDeleteClick = () => {}
}: { 
    state: DataRow
    , mode: 'create' | 'update'
    , editable?: boolean
    , onChange?: (state: DataRow) => void
    , onSaveClick?: () => void
    , onDeleteClick?: () => void
}) {

    const [formState, setFormState] = useState(state);
    const isInvalid = useRef(false);


    /* Methods */
    const changeState = (field: DataField, value: any) => {
        const newFormState = new DataRow(formState.tableName, formState.json);
        
        newFormState.setFieldValue(field, value);
        console.log(newFormState)

        setFormState(newFormState);
        onChange(newFormState);
    }
       

    /* Handlers */
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>, field: DataField) => {
        if (field.type === 'number' && isNaN(Number(e.target.value))) {
            return;
        }
        changeState(field, e.target.value);
    };

    const handleStep = (field: DataField, operation: string, stepVal: number = 1) => {
        const step = operation === 'sum' ? stepVal : -stepVal;
        if(field.props.max && Number(field.value) + step > Number(field.props.max)) return;
        if(field.props.min && Number(field.value) + step < Number(field.props.min)) return;
        const value = Number(formState.json[field.name]) + step
        changeState(field, value);
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

    const handleOptionClick = (field: DataField, option: DataField) => {
        changeState(field, option.value);
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
            case 'text':
            case 'password':
            case 'email':
                newIsInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Input 
                            type={field.type} 
                            value={value}
                            minLength={field.props.minLength}
                            maxLength={field.props.maxLength}
                            placeholder='Type...' 
                            isDisabled={!editable && mode === 'update'}
                            onChange={(e) => handleFieldChange(e, field)}
                        />

                        <FormErrorMessage>{field.message}</FormErrorMessage>
                    </FormControl>
                );
            case 'number':
                newIsInvalid = ((field.required && field.value === '') || Number(value) < field.props.min || Number(value) > field.props.max);

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <NumberInput value={value} min={field.props.min} isDisabled={!editable && mode === 'update'}>
                            <NumberInputField onChange={(e) => handleFieldChange(e, field)} onKeyDown={(e) => handleOnKeyDown(e, field)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleStep(field, 'sum')} />
                                <NumberDecrementStepper onClick={() => handleStep(field, 'sub')} />
                            </NumberInputStepper>
                        </NumberInput>
                        {mode === 'create' && <FormHelperText>Hold down CTRL + Arrow Up/Down to modify in increments of 10</FormHelperText>}
                        <FormErrorMessage>{field.message}</FormErrorMessage>
                    </FormControl>
                );
            case 'boolean':
                newIsInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={newIsInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Switch 
                            isChecked={Boolean(value)} 
                            onChange={(e) => handleFieldChange(e, field)}
                        />
                    </FormControl>
                );
            case 'select':
                return (
                    <VirtualizedSelect 
                        key={identifier}
                        field={field}
                        data={field.props.data}
                        disabled={!editable && mode === 'update'}
                        onOptionClick={handleOptionClick}
                    />
                );
        }

        isInvalid.current = newIsInvalid;
    });

    const modalFooterCreateMode = <Button colorScheme="blue" onClick={onSaveClick}>Save</Button>;

    const modalFooterEditMode = <>
        <ConfirmationPopover onYes={onDeleteClick}>
            <Button colorScheme="red" variant='outline'>Delete</Button>
        </ConfirmationPopover>
        {editable && <Button colorScheme="blue" onClick={onSaveClick}>Save</Button>}
    </>

    return (<div className='flex flex-col gap-4'>
        {fieldComponents}

        <div className={`flex ${mode === 'create' ? 'justify-end' : 'justify-between'}`}>
            {mode === 'create' ? modalFooterCreateMode : modalFooterEditMode}
        </div>
    </div>);
}