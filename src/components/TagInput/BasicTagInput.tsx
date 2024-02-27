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
                <BasicFormField key={'category'} field={tag.getField('category')} />
                , <BasicFormField key={'registry_counter'} field={tag.getField('registry_counter')} />
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
        tprod_productTagsCheckAvailability 
        , fetchData
    } = useData();

    const [tag, setTag] = React.useState<DataRow>(new DataRow('tprod_producttags'));
    const [partialTag, setPartialTag] = React.useState<DataRow>(new DataRow('', {}, configs[objectType]));

    const [message, setMessage] = React.useState<string>('');
    const [isAvailable, setIsAvailable] = React.useState<boolean>(false);
    const [isDisabledSubmit, setIsDisabledSubmit] = React.useState<boolean>(true);

    const [value, setValue] = React.useState<string>('');

    React.useEffect(() => {
        retrieveCategories();
    }, []);


    /* Methods */
    const retrieveCategories = async () => {
        const selectFields = partialTag.fields.filter((field) => {
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
        setPartialTag(newTag);
    }

    const handleValidityChange = async (isValid: boolean) => {
        if (isValid === false) {
            setMessage('');
            return;
        }

        const { response, data } = await tprod_productTagsCheckAvailability(partialTag);
        const isAvailable = data.available;
        
        if (response.ok) {
            setIsDisabledSubmit(false);
            setIsAvailable(isAvailable);
            setMessage(data.message);
        }
    }

    const handleSubmit = async () => {
        // const newTag = new DataRow('tsys_tags');

        // for (const field of partialTag.fields) {
        //     newTag.setValue(field, field.value);
        // }

        // const { response, data } = await tsys_tagsCheckAvailability(newTag, objectType);
        // const isAvailable = data.available;

        // if (response.ok && isAvailable) {

        //     setValue(Object.values(newTag.json).join(''));
        //     onSubmit(tag);

        //     const newPartialTag = new DataRow('', {}, configs[objectType]);
        //     setPartialTag(newPartialTag);
        //     setTag(newTag);
        // }
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
                <BasicTagButton onSubmit={handleSubmit} row={partialTag} message={message} isAvailable={isAvailable} isDisabledSubmit={isDisabledSubmit}>
                    <BasicForm 
                        row={partialTag}
                        mode={'create'}
                        defaultFooter={false}
                        onChange={handleOnChange}
                        onValidityChange={handleValidityChange}
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