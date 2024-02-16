import React from "react";
import { 
    FormControl
    , FormLabel
    , FormErrorMessage
    , FormHelperText
    , Input
} from "@chakra-ui/react";
import BasicTagButton from "./BasicTagButton";
import BasicForm, { BasicFormField } from "../BasicForm/BasicForm";
import { useTag } from "../../hooks/useTag";
import { DataRow } from "../../providers/data/models";

const tagModel = (tag: DataRow, tableName: string) => {
    switch (tableName) {
        case 'tprod_resources':
            const codeAField = tag.getField('code_a');

            codeAField.label = 'Code';
            codeAField.required = true;
            codeAField.errorMessage = 'This field is required';
            codeAField.helperMessage = 'A letter that represents the tag';

            return [
                <BasicFormField key={codeAField.name} field={codeAField} />
            ];
        default:
            return null;
    }
}


export default function SimpleTagInput({
    mode
    , onSubmit
}:
{
    mode: 'create' | 'update';
    onSubmit: (row: DataRow) => void;
}) {

    const { tag, handleTagFormOnChange } = useTag();
    const [value, setValue] = React.useState<string>('');

    const handleSubmit = () => {
        // call API here, get full object, and pass it to onSubmit, aggregate gets passed to setValue
        setValue(String(tag.getField('code_a').value));
        onSubmit(tag);
    }


    return (
        <FormControl isRequired={true} isInvalid={value === ''}>
            <FormLabel>{'Tag'}</FormLabel>
            <div className='flex items-center gap-2'>
                <Input 
                    bg={'white'}
                    type={'text'}
                    value={value}
                    isDisabled={true}
                />
                {mode === 'create' &&
                <BasicTagButton onSubmit={handleSubmit}>
                    <BasicForm 
                        row={tag}
                        mode={'create'}
                        defaultFooter={false}
                        onChange={handleTagFormOnChange}
                    >
                        {tagModel(tag, 'tprod_resources')}
                    </BasicForm>
                </BasicTagButton>}
            </div>

            <FormErrorMessage>Click the button to create a tag</FormErrorMessage>
            <FormHelperText>A tag is a unique identifier attached to an object</FormHelperText>
        </FormControl>
    );
}