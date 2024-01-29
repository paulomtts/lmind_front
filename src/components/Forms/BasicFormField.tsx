import React from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,

    Input,
    Switch,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { v4 } from 'uuid';

import { DataField } from '../../providers/data/models';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper';
import VirtualizedSelect from '../VirtualizedSelect/VirtualizedSelect';

export default function BasicFormField({
    field
    , component
} : {
    field: DataField
    , component?: DataField
}) {

    return (<>
        {component}
    </>);

}