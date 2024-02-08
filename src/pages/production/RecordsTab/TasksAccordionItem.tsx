import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';



export default function TasksAccordionItem() {

    const { 
        fetchData
        , tprod_tasksUpsert
        , tprod_tasksDelete
    } = useData();

    const initialData = new DataObject('tprod_tasks');
    const initialState = new DataRow('tprod_tasks');

    const [tasks, setTasks] = useState<DataObject>(initialData);
    const [state, setState] = useState<DataRow>(initialState);
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState<boolean>(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tprod_tasks', {notification: false});

        if (response.ok) {
            setTasks(newData);
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

    const handleCreateClick = async () => {
        const field = initialState.getField('id_unit');

        if (field) {
            const { data } = await fetchData('tsys_units', {
                filters: field.props.filters
                , lambdaKwargs: {type: 'time'}
                , notification: false
                , overlay: false
            });
            field.props.data = data;
        }

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

    const handleFormSaveClick = async () => {
        console.log(state.json)
        const { response, data } = await tprod_tasksUpsert(state);

        if (response.ok) {
            setTasks(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_tasksDelete(state);

        if (response.ok) {
            setTasks(data);
        }

        setIsOpen(false);
    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete tasks</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Task
            </Button>
        </div>

        <BasicModal 
            title={mode === 'create' ? 'New Task' : 'View Task'}
            width='60%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <BasicForm 
                row={state}
                mode={mode}
                onChange={handleFormOnChange}
                onSave={handleFormSaveClick}
                onDelete={handleFormDeleteClick}
            >
                <BasicFormField field={state.getField('name')} />
                <BasicFormField field={state.getField('description')} />
                <BasicFormField field={state.getField('duration')} />
                <BasicFormField field={state.getField('id_unit')} />
                {/* {mode === 'update' && <BasicFormField field={state.getField('unit')} />} */}
                <BasicFormField field={state.getField('interruptible')} />
                <BasicFormField field={state.getField('error_margin')} />   
            </BasicForm>
        </BasicModal>


        <VirtualizedTable 
            data={tasks}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </div>)
}