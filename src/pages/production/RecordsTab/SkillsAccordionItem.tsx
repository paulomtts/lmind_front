import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import VTable, { VTableColumn } from '../../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';



export default function SkillsAccordionItem() {

    const { 
        fetchData
        , tprod_skillsUpsert 
        , tprod_skillsDelete
    } = useData();

    const initialData = new DataObject('tprod_skills');
    const initialState = new DataRow('tprod_skills');

    const [data, setData] = useState<DataObject>(initialData);
    const [state, setState] = useState<DataRow>(initialState);
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tprod_skills', {notification: false});

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
        const { response, data } = await tprod_skillsUpsert(state);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_skillsDelete(state);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete skills</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Skill
            </Button>
        </div>

        <BasicModal 
            title={mode === 'create' ? 'New Skill' : 'View Skill'}
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
                <BasicFormField field={state.getField('created_by')} />
                <BasicFormField field={state.getField('created_at')} />
                <BasicFormField field={state.getField('updated_by')} />
                <BasicFormField field={state.getField('updated_at')} />   
            </BasicForm>
        </BasicModal>


        <VTable 
            data={data}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        >
            <VTableColumn name='name' />
            <VTableColumn name='description' />
        </VTable>
    </div>)
}