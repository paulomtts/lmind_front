import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import GenericForm from '../../components/GenericForm/GenericForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { url, useData, DataObject, DataRow } from '../../providers/data/DataProvider';


export default function SymbolsTab() {

    const { fetchData, customRoute, generatePayload, getState } = useData();

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
            field.props.data = getState('tsys_categories');
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

        console.log(formState.json)

        const payload = generatePayload({
            method: 'POST'
            , body: JSON.stringify(formState.json)
        });
        const {response, content } = await customRoute(url.custom.symbols.insert, payload);

        if (response.ok) {
            const json = JSON.parse(content.data);
            const newData = new DataObject('tsys_units', json);

            setData(newData);
        }
        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        
        const payload = generatePayload({
            method: 'DELETE'
            , body: JSON.stringify(formState.json)
        });
        const {response, content } = await customRoute(url.custom.symbols.delete, payload);

        if (response.ok) {
            const json = JSON.parse(content.data);
            const newData = new DataObject('tsys_units', json);

            setData(newData);
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
            width='85%'
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
        </BasicModal>


        <VirtualizedTable 
            data={data}
            onClickRow={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </Box>)
}