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

    const [data, setData] = useState<DataObject>(initialData);
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tprod_tasks', {}, {}, false);

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

    const handleCreateClick = async () => {
        const field = initialState.getFieldObject('id_unit');
        console.log(field.props.filters)
        if (field) {
            const { data } = await fetchData('tsys_units', field.props.filters, {type: 'time'}, false, true, true);
            field.props.data = data;
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
        const { response, data } = await tprod_tasksUpsert(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_tasksDelete(formState);

        if (response.ok) {
            setData(data);
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
            title={formMode === 'create' ? 'New Task' : 'View Task'}
            width='60%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <BasicForm 
                row={formState}
                mode={formMode}
                onChange={handleFormOnChange}
                onSave={handleFormSaveClick}
                onDelete={handleFormDeleteClick}
            >
                <BasicFormField field={formState.getFieldObject('name')} />
                <BasicFormField field={formState.getFieldObject('description')} />
                <BasicFormField field={formState.getFieldObject('duration')} />
                <BasicFormField field={formState.getFieldObject('id_unit')} />
                <BasicFormField field={formState.getFieldObject('interruptible')} />
                <BasicFormField field={formState.getFieldObject('error_margin')} />   
            </BasicForm>
        </BasicModal>


        <VirtualizedTable 
            data={data}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </div>)
}