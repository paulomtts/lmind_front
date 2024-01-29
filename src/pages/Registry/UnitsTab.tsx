import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import GenericForm from '../../components/GenericForm/GenericForm';
import BasicForm, { BasicFormField } from '../../components/Forms/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { url, useData, DataObject, DataRow, DataField } from '../../providers/data/DataProvider';


export default function UnitsTab() {

    const { 
        fetchData
        , getState
        , tsys_unitsInsert 
        , tsys_unitsDelete
    } = useData();

    const initialData = new DataObject('tsys_units');
    const initialState = new DataRow('tsys_units');

    const [data, setData] = useState<DataObject>(initialData);
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tsys_units');

        if (response.ok) {
            setData(newData);
        }
    }


    /* Effects */
    useEffect(() => {
        retrieveData();
    }, []);


    /* Handlers */
    const handleRefreshClick = () => {
        retrieveData();
    }

    const handleCreateClick = () => {
        const field = initialState.getFieldObject('type');

        if (field) {
            field.props.data = getState(field.props.tableName);
        }

        setFormState(initialState);
        setFormMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = (newState: DataRow) => {
        setFormState(newState);
        setFormMode('update');

        setIsOpen(true);
    }

    const handleFormOnChange = (newState: DataRow) => {
        setFormState(newState);
    }

    const handleFormSaveClick = async () => {
        const { response, data } = await tsys_unitsInsert(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tsys_unitsDelete(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }


    return (<Box className='flex flex-col gap-4'>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <span>Create, edit and visualize measurement units.</span>
            <div className='flex justify-between gap-2'>
                <Button colorScheme="blue" onClick={handleCreateClick}>
                    New Unit
                </Button>
            </div>
        </Box>

        <BasicModal 
            title={formMode === 'create' ? 'New Unit' : 'View Unit'}
            width='60%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <GenericForm 
                state={formState}
                mode={formMode}
                editable={false}
                onChange={handleFormOnChange}
                onSaveClick={handleFormSaveClick}
                onDeleteClick={handleFormDeleteClick}
            />

            {/* <BasicForm 
                row={formState}
                readonly={formMode === 'update'}
                onSave={handleFormSaveClick}
                onDelete={handleFormDeleteClick}
            >
                <BasicFormField field={formState.getFieldObject('name')} />
                <BasicFormField field={formState.getFieldObject('abbreviation')} />
                <BasicFormField field={formState.getFieldObject('type')} />
            </BasicForm> */}

        </BasicModal>


        <VirtualizedTable 
            data={data}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </Box>)
}