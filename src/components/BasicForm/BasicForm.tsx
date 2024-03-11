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
import BasicFormField from './BasicFormField';

export default function BasicForm({
    row
    , mode = 'create'
    , allowUpdates = true
    , defaultFooter = true
    , children
    , onChange = () => {}
    , onSave = () => {}
    , onDelete = () => {}
    , onBlur = () => {}
}: { 
    row: DataRow
    , mode: 'create' | 'update'
    , allowUpdates?: boolean
    , defaultFooter?: boolean
    , children?: React.ReactNode
    , onChange?: (state: DataRow) => void
    , onSave?: () => void
    , onDelete?: () => void
    , onBlur?: () => void
}) {

    const [state, setState] = React.useState(row);


    /* Effects */
    React.useEffect(() => {
        setState(row);
    }, [row]);


    /* Methods */
    const changeState = (field: DataField, value: any) => {
        const newFormState = state.clone();
        newFormState.setValue(field.name, value);
        
        setState(newFormState);
        onChange(newFormState);
    }

    const checkValidity = (newState: DataRow) => {
        return newState.fields.every((field: DataField) => {
            if (field.required) {
                switch (field.type) {
                    case 'number':
                        if (isNaN(Number(field.value))) {
                            return false;
                        }
                        if (Number(field.value) < field.props.min || Number(field.value) > field.props.max) {
                            return false;
                        }
                        break;
                    default:
                        if (!field.value) {
                            return false;
                        }
                }
            }
            return true;
        });
    }
       

    /* Handlers */
    const handleFieldChange = (field: DataField, e: ChangeEvent<HTMLInputElement>) => {
        if (field.type === 'number' && isNaN(Number(e.target.value))) {
            return;
        }
        
        let value: string | number | boolean | Date;
        switch (field.type) {
            case 'number':
                value = Number(e.target.value);
                break;
            case 'checkbox':
            case 'boolean':
                value = !field.value;
                break;
            default:
                value = e.target.value;
                break;
        }

        changeState(field, value);
    };

    const handleStep = (field: DataField, operation: string, stepVal: number = 1) => {
        const step = operation === 'sum' ? stepVal : -stepVal;

        if(Number(field.value) + step > Number(field.props.max)) return;
        if(Number(field.value) + step < Number(field.props.min)) return;
        
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

    const handleOptionClick = (field: DataField, option: DataField, _: DataRow) => {
        changeState(field, option.value);
    }
    
    const handleBlur = () => {
        onBlur();
    }

    const fieldComponents = state.fields.map((field: DataField, index: number) => {
        const childrenFields = React.Children.map(children, (child: any) => child.props.field);
        if (!childrenFields.includes(field)) return null;

        const identifier = `APIForm-field-${field.label}-${index}`;
        const value = String(field.value);
        const isDisabled = mode === 'create' ? false : !(field.editable && allowUpdates);

        if (mode === 'create' && field.visible?.create === false) {
            return null;
        }
        
        if (mode === 'update' && field.visible?.update === false) {
            return null;
        }
        
        let isInvalid = field.required && field.value === '';
        

        switch (field.type) {
            case 'text':
            case 'password':
            case 'email':
            case 'date':
            case 'datetime':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Input 
                            bg={'white'}
                            type={field.type} 
                            value={value}
                            minLength={field.props.minLength}
                            maxLength={field.props.maxLength}
                            placeholder='Type...' 
                            isDisabled={isDisabled}
                            onChange={(e) => handleFieldChange(field, e)}
                            onBlur={handleBlur}
                        />
                        <FormErrorMessage>{field.errorMessage}</FormErrorMessage>
                        <FormHelperText>{field.helperMessage}</FormHelperText>
                    </FormControl>
                );
            case 'number':
                isInvalid = (field.required && field.value === '') || Number(value) < field.props.min || Number(value) > field.props.max;

                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <NumberInput value={value} min={field.props.min} isDisabled={isDisabled} bg={'wwhite'}>
                            <NumberInputField onChange={(e) => handleFieldChange(field, e)} onKeyDown={(e) => handleOnKeyDown(field, e)} onBlur={handleBlur} />
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleStep(field, 'sum')} />
                                <NumberDecrementStepper onClick={() => handleStep(field, 'sub')} />
                            </NumberInputStepper>
                        </NumberInput>
                        {mode === 'create' && <FormHelperText>{field.helperMessage || "Hold down CTRL + Arrow Up/Down to modify in increments of 10"}</FormHelperText>}
                        <FormErrorMessage>{field.errorMessage}</FormErrorMessage>
                    </FormControl>
                );
            case 'checkbox':
            case 'boolean':
                return (
                    <FormControl id={identifier} key={identifier} isRequired={field.required} isInvalid={isInvalid}>
                        <FormLabel>{field.label}</FormLabel>
                        <Switch 
                            defaultChecked={field.value as boolean}
                            onChange={(e) => handleFieldChange(field, e)}
                            disabled={isDisabled}
                        />
                        <FormHelperText>Click to toggle</FormHelperText>
                    </FormControl>
                );
            case 'select':
                return (
                    <FormFieldWrapper
                        key={identifier}
                        label={field.label}
                        required={field.required}
                        isInvalid={isInvalid}
                        errorMessage={field.errorMessage}
                        helperMessage={field.helperMessage}
                    >
                        <VirtualizedSelect 
                            field={field}
                            data={field.props.data}
                            disabled={isDisabled}
                            onOptionClick={handleOptionClick}
                            onBlur={handleBlur}
                        />
                    </FormFieldWrapper>
                );
        }
    });

    return (<div className='flex flex-col gap-4 ml-2'>

        {fieldComponents}

        {defaultFooter && <div className={`flex ${mode === 'create' ? 'justify-end' : 'justify-between'}`}>
            {mode === 'update' && 
                <ConfirmationPopover onYes={onDelete}>
                    <Button colorScheme="red" variant='outline'>Delete</Button>
                </ConfirmationPopover>
            }
            <Button 
                colorScheme="blue" 
                onClick={onSave} 
                isDisabled={!checkValidity(state) || (mode === 'update' && !allowUpdates)}
            >
                Save
            </Button>
        </div>}
    </div>);
}

export { BasicFormField }