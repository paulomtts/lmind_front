import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import BasicForm from '../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import ConfirmationPopover from '../../components/ConfirmationPopover/ConfirmationPopover';
import { useData, DataObject, DataRow } from '../../providers/data/DataProvider';


export default function SymbolsTab() {

    const { fetchData, updateData, insertData } = useData();

    const initialState = new DataObject('tsys_symbols');
    const emptyRow = new DataRow(initialState.tableName);

    const [data, setData] = useState<DataObject>(initialState);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currState, setCurrState] = useState<DataRow>(emptyRow);


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
    const handleCreateClick = () => {
        setCurrState(emptyRow);
        setModalIsOpen(true);
    }
    
    const handleSaveClick = () => {
        setModalIsOpen(false);
    }

    const handleDeleteClick = () => {
        // call api here (with returning)
        setModalIsOpen(false);
    }

    const handleEditClick = (newState: DataRow) => {
        setCurrState(newState);
        setModalIsOpen(true);
    }

    const handleFormStateChange = (newState: DataRow) => {
        setCurrState(newState);
    }

    const handleRefreshClick = () => {
        retrieveData();
    }


    /* Components */
    const modalFooterCreateMode = [
        <div key='modal-footer-empty' />
        , <Button key='modal-footer-save' colorScheme="blue" onClick={handleSaveClick}>Save</Button>
    ];

    const modalFooterEditMode = [
        <ConfirmationPopover key='task-modal-popover' onYes={handleDeleteClick}>
            <Button colorScheme="red" variant='outline'>Delete</Button>
        </ConfirmationPopover>

        , <Button key='task-modal-save' colorScheme="blue" onClick={handleSaveClick}>Save</Button>
    ];


    return (<Box className='flex flex-col gap-4'>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <span>Use this area to view, edit and create tasks.</span>
            <div className='flex justify-between'>
                <Button colorScheme="blue" onClick={handleCreateClick}>
                    New Task
                </Button>
            </div>
        </Box>

        <BasicModal 
            title="New Task" 
            width='85%'
            blur
            isOpen={modalIsOpen} 
            footer={currState === emptyRow ? modalFooterCreateMode : modalFooterEditMode}
            onClose={() => setModalIsOpen(false)}
        >
            <BasicForm row={currState} onChange={handleFormStateChange} />
        </BasicModal>

        {data.json.length > 0 &&
        <VirtualizedTable 
            columns={data.columns}
            initialData={data}
            onClickRow={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />}
    </Box>)
}