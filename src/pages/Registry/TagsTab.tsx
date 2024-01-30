import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

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

    const initialData = new DataObject('tsys_tags');
    const initialState = new DataRow('tsys_tags');

    const [data, setData] = useState<DataObject>(initialData);
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tsys_tags');
        
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

        <div className='flex justify-between items-center mt-2 mb-2'>
            <span>Create, edit and visualize measurement units.</span>
        </div>

        <VirtualizedTable 
            data={data}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </Box>)
}