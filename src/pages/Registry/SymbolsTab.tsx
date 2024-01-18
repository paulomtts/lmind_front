import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import Select from '../../components/Select/Select';
import BasicModal from '../../components/BasicModal/BasicModal';
import BasicForm from '../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject, DataRow } from '../../providers/data/DataProvider';


const tmpData = new DataObject('tsys_symbols', [
    { id: 1, name: 'test' }
    , { id: 2, name: 'test 2' }
    , { id: 3, name: 'test 3' }
    , { id: 4, name: 'test 4' }
    , { id: 5, name: 'test 5' }
    , { id: 6, name: 'test 6' }
    , { id: 7, name: 'test 7' }
    , { id: 8, name: 'test 8' }
    , { id: 9, name: 'test 9' }
    , { id: 10, name: 'test 10' }
]);



export default function SymbolsTab() {

    const { fetchData, updateData, insertData } = useData();

    const initialData = new DataObject('tsys_symbols');
    const initialState = new DataRow('tsys_symbols');

    const [data, setData] = useState<DataObject>(initialData);
    const [state, setState] = useState<DataRow>(initialState);
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    async function retrieveData() {
        const { response, data } = await fetchData('tsys_symbols');
        
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
        setState(initialState);
        setMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = (newState: DataRow) => {
        setState(newState);
        setMode('update');

        setIsOpen(true);
    }

    const handleFormOnChange = (newState: DataRow) => {
        setState(newState);
    }

    const handleFormSaveClick = () => {
        if (mode === 'create') {
            // call api INSERT
        } else if (mode === 'update') {
            // call api UPDATE
        }
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
                <Select data={tmpData} fieldName='name'/>
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
                state={state} 
                mode={mode} 
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