import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import BasicForm from '../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { url, useData, DataObject, DataRow } from '../../providers/data/DataProvider';


export default function SymbolsTab() {

    const { fetchData, customRoute, generatePayload } = useData();

    const initialData = new DataObject('tsys_symbols');
    const initialState = new DataRow('tsys_symbols');

    const [data, setData] = useState<DataObject>(initialData);
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);

    async function retrieveData() {
        const { response, data } = await fetchData('tsys_symbols');
        console.log(data)
        if (response.ok) {
            setData(data);
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
        console.log(formState.json)
        const payload = generatePayload({
            method: 'POST'
            , body: JSON.stringify(formState.json)
        });
        await customRoute(url.custom.symbols.upsert, payload);
        setIsOpen(false);
    }

    const handleFormDeleteClick = () => {
        // call api here (with returning)
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
            title="New Unit" 
            width='85%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <BasicForm 
                state={formState} 
                mode={formMode} 
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