import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject, DataRow } from '../../providers/data/DataProvider';


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
        const { response, data: newData } = await fetchData('tsys_units', {notification: false});

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
        const field = initialState.getFieldObject('type');

        if (field) {
            field.props.data = getState(field.props.tableName);
        }

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


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Create, edit and visualize measurement units.</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Unit
            </Button>
        </div>

        <BasicModal 
            title={formMode === 'create' ? 'New Unit' : 'View Unit'}
            width='60%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <BasicForm 
                row={formState}
                mode={formMode}
                allowUpdates={false}
                onChange={handleFormOnChange}
                onSave={handleFormSaveClick}
                onDelete={handleFormDeleteClick}
            >
                <BasicFormField field={formState.getFieldObject('name')} />
                <BasicFormField field={formState.getFieldObject('abbreviation')} />
                <BasicFormField field={formState.getFieldObject('type')} />
            </BasicForm>

        </BasicModal>


        <VirtualizedTable 
            data={data}
            editable
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </div>)
}