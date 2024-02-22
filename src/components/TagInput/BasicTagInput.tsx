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
import configs from "./configs.json"


const tagModel = (tag: DataRow, objectType: string) => {
    switch (objectType) {
        case 'product':
            return [
                <BasicFormField key={'code_a'} field={tag.getField('code_a')} />
                , <BasicFormField key={'counter_a'} field={tag.getField('counter_a')} />
            ]
        default:
            return null;
    }
}


export default function BasicTagInput({
    objectType
    , mode
    , onSubmit
}: {
    objectType: 'product'
    mode: 'create' | 'update';
    onSubmit: (row: DataRow) => void;
}) {

    const { 
        tsys_tagsCheckAvailability 
        , fetchData
    } = useData();

    const [tag, setTag] = React.useState<DataRow>(new DataRow('tsys_tags'));
    const [partialTag, setPartialTag] = React.useState<DataRow>(new DataRow('', {}, configs[objectType]));
    const [value, setValue] = React.useState<string>('');

    React.useEffect(() => {
        retrieveTagCategories();
    }, []);


    /* Methods */
    const retrieveTagCategories = async () => {
        const selectFields = partialTag.fields.filter((field) => {
            return field.type === 'select';
        });

        for (const field of selectFields) {
            const { data } = await fetchData('tsys_tags', {
                filters: field.props.filters
                , notification: false
                , overlay: false
            });
            field.props.data = data;
        }
    }

    /* Handlers */
    const handleOnChange = (newTag: DataRow) => {
        console.log(newTag.json)
        setPartialTag(newTag);
    }

    const handleSubmit = async () => {
        for (const field of partialTag.fields) {
            tag.setValue(field, field.value);
        }

        const { response, data } = await tsys_tagsCheckAvailability(tag, objectType);
        const isAvailable = data.available;

        if (response.ok && isAvailable) {
            setValue(Object.values(tag.json).join(''));
            onSubmit(tag);
        }
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
                        row={partialTag}
                        mode={'create'}
                        defaultFooter={false}
                        onChange={handleOnChange}
                    >
                        {tagModel(partialTag, objectType)}
                    </BasicForm>
                </BasicTagButton>}
            </div>

            <FormErrorMessage>Click the button to create a tag</FormErrorMessage>
            <FormHelperText>A tag is a unique identifier attached to an object</FormHelperText>
        </FormControl>
    );
}