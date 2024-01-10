import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import BasicModal from '../../components/BasicModal/BasicModal';
import BasicForm from '../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import ConfirmationPopover from '../../components/ConfirmationPopover/ConfirmationPopover';
import { FormField } from '../../components/BasicForm/models';


export default function TasksTab() {
    
    ///////////////////////////////////////////////////
    const columns = ['Name', 'Description', 'Status']
    const taskModel = [
        new FormField('Name'),
        new FormField('Description'),
        new FormField('Status'),
    ];
    const initialData = [...Array(1000)].map((_, i) => ({
        Name: `Task ${i}`,
        Description: `Description ${i}`,
        Status: i,
    }));
    ///////////////////////////////////////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currState, setCurrState] = useState(taskModel);


    /* Handlers */
    const handleCreateClick = () => {
        setCurrState(taskModel);
        setModalIsOpen(true);
    }
    
    const handleSaveClick = () => {
        // call api here (with returning)
        setModalIsOpen(false);
    }

    const handleDeleteClick = () => {
        // call api here (with returning)
        setModalIsOpen(false);
    }

    const handleEditClick = (state: FormField[]) => {
        setCurrState(state);
        setModalIsOpen(true);
    }

    const handleFormStateChange = (state: FormField[]) => {
        setCurrState(state);
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


    return (<Box display={'flex'} flexDirection={'column'} gap={'1rem'}>

        <Box display={'flex'} justifyContent={'space-between'}>
            <span>Use this area to view, edit and create tasks.</span>
            <div className='flex justify-between'>
                <Button colorScheme="green" onClick={handleCreateClick}>
                    New Task
                </Button>
            </div>
        </Box>

        <BasicModal 
            title="New Task" 
            width='85%'
            blur
            isOpen={modalIsOpen} 
            footer={currState === taskModel ? modalFooterCreateMode : modalFooterEditMode}
            onClose={() => setModalIsOpen(false)}
        >
            <BasicForm fields={currState} onChange={handleFormStateChange} />
        </BasicModal>

        <VirtualizedTable columns={columns} initialData={initialData} onClickRow={handleEditClick}/>
    </Box>)
}