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
import { DataRow } from "../../providers/data/models";
import { useData } from "../../providers/data/DataProvider";


const tagModel = (tag: DataRow, objectType: string) => {
    switch (objectType) {
        case 'tprod_producttags':
            return [
                <BasicFormField key={'category'} field={tag.getField('category')} />
                , <BasicFormField key={'registry_counter'} field={tag.getField('registry_counter')} />
            ]
        default:
            return null;
    }
}


export default function BasicTagInput({
    tableName
    , mode
    , onSubmit
}: {
    tableName: 'tprod_producttags'
    mode: 'create' | 'update';
    onSubmit: (row: DataRow) => void;
}) {

    const { fetchData } = useData();

    const [tag, setTag] = React.useState<DataRow>(new DataRow(tableName));
    const [value, setValue] = React.useState<string>('');


    React.useEffect(() => {
        retrieveCategories();
    }, []);


    /* Methods */
    const retrieveCategories = async () => {
        const selectFields = tag.fields.filter((field) => {
            return field.type === 'select';
        });

        for (const field of selectFields) {
            const { data } = await fetchData(field.props.tableName, {
                notification: false
                , overlay: false
            });

            field.props.data = data;
        }
    }


    /* Handlers */
    const handleOnChange = (newTag: DataRow) => {
        setTag(newTag);
    }


    const handleSubmit = async (row: DataRow, isAvailable: boolean) => {
        if (isAvailable === false) {
            setTag(row);
            return;
        }

        const newValue = Object.values(tag.json).join('');
        
        setValue(newValue);
        onSubmit(row);
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
                <BasicTagButton onSubmit={handleSubmit} row={tag} tableName={tableName}>
                    <BasicForm 
                        row={tag}
                        mode={'create'}
                        defaultFooter={false}
                        onChange={handleOnChange}
                    >
                        {tagModel(tag, tableName)}
                    </BasicForm>
                </BasicTagButton>}
            </div>

            <FormErrorMessage>Click the button to create a tag</FormErrorMessage>
            <FormHelperText>A tag is a unique identifier attached to an object</FormHelperText>
        </FormControl>
    );
}