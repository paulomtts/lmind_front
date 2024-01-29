import React, { ChangeEvent } from 'react';
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
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper';
import { DataField, DataRow } from '../../providers/data/models';
import FormField from './FormField';

export default function Form({
    row
    , mode = 'create'
    , editable = true
    , children
    , onChange = () => {}
    , onSave = () => {}
    , onDelete = () => {}
}: { 
    row: DataRow
    , mode: 'create' | 'update'
    , editable?: boolean
    , children?: React.ReactNode
    , onChange?: (state: DataRow) => void
    , onSave?: () => void
    , onDelete?: () => void
}) {

    const [state, setState] = React.useState(row);


    /* Methods */
    const changeState = (field: DataField, value: any) => {
        const newFormState = new DataRow(state.tableName, state.json);
        
        newFormState.setFieldValue(field, value);

        setState(newFormState);
        onChange(newFormState);
    }
       

    /* Handlers */
    const handleFieldChange = (field: DataField, e: ChangeEvent<HTMLInputElement>) => {
        if (field.type === 'number' && isNaN(Number(e.target.value))) {
            return;
        }
        changeState(field, e.target.value);
    };

    const handleStep = (field: DataField, operation: string, stepVal: number = 1) => {
        const step = operation === 'sum' ? stepVal : -stepVal;
        if(field.props.max && Number(field.value) + step > Number(field.props.max)) return;
        if(field.props.min && Number(field.value) + step < Number(field.props.min)) return;
        const value = Number(state.json[field.name]) + step
        changeState(field, value);
    }

    const handleOnKeyDown = (field: DataField, e: React.KeyboardEvent) => {
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
    

    const fieldComponents = state.fields.map((field: DataField, index: number) => {
        const childrenFields = React.Children.map(children, (child: any) => child.props.field);
        if (!childrenFields.includes(field)) return null;

        const identifier = `APIForm-field-${field.label}-${index}`;
        const value = String(field.value);

        let isInvalid = false;

        if (field.visible === false) {
            return null;
        }

        if (field.props && mode === 'create' && field.props.crud?.visible.create === false) {
            return null;
        }


        switch (field.type) {
            case 'text':
            case 'password':
            case 'email':
                isInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Input 
                            type={field.type} 
                            value={value}
                            minLength={field.props.minLength}
                            maxLength={field.props.maxLength}
                            placeholder='Type...' 
                            isDisabled={!editable && mode === 'update'}
                            onChange={(e) => handleFieldChange(field, e)}
                        />

                        <FormErrorMessage>{field.errorMessage}</FormErrorMessage>
                    </FormControl>
                );
            case 'number':
                isInvalid = ((field.required && field.value === '') || Number(value) < field.props.min || Number(value) > field.props.max);

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <NumberInput value={value} min={field.props.min} isDisabled={!editable && mode === 'update'}>
                            <NumberInputField onChange={(e) => handleFieldChange(field, e)} onKeyDown={(e) => handleOnKeyDown(field, e)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleStep(field, 'sum')} />
                                <NumberDecrementStepper onClick={() => handleStep(field, 'sub')} />
                            </NumberInputStepper>
                        </NumberInput>
                        {mode === 'create' && <FormHelperText>Hold down CTRL + Arrow Up/Down to modify in increments of 10</FormHelperText>}
                        <FormErrorMessage>{field.errorMessage}</FormErrorMessage>
                    </FormControl>
                );
            case 'boolean':
                isInvalid = (field.required && field.value === '');

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Switch 
                            isChecked={Boolean(value)} 
                            onChange={(e) => handleFieldChange(field, e)}
                        />
                    </FormControl>
                );
            case 'select':
                return (
                    <FormFieldWrapper
                        key={identifier}
                        label={field.label}
                        required={field.required}
                        isInvalid={field.required && !field.value}
                        errorMessage={field.errorMessage}
                        helperMessage={field.props.helperMessage}
                    >
                        <VirtualizedSelect 
                            field={field}
                            data={field.props.data}
                            disabled={!editable && mode === 'update'}
                            onOptionClick={handleOptionClick}
                        />
                    </FormFieldWrapper>
                );
        }
    });

    return (<div className='flex flex-col gap-4'>

        {fieldComponents}

        <div className={`flex ${mode === 'create' ? 'justify-end' : 'justify-between'}`}>
            {mode === 'update' ?            
                <>
                    <ConfirmationPopover onYes={onDelete}>
                        <Button colorScheme="red" variant='outline'>Delete</Button>
                    </ConfirmationPopover>
                    {editable && <Button colorScheme="blue" onClick={onSave}>Save</Button>}
                </> 
                
                : 
    
                <Button colorScheme="blue" onClick={onSave}>Save</Button>
            }
        </div>
    </div>);
}

export { FormField }