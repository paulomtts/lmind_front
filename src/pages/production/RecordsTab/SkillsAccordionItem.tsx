import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../../components/VirtualizedTable/VirtualizedTable';
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
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tprod_skills', {}, {}, false);

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
        const { response, data } = await tprod_skillsUpsert(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_skillsDelete(formState);

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
            title={formMode === 'create' ? 'New Skill' : 'View Skill'}
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
                <BasicFormField field={formState.getFieldObject('created_by')} />
                <BasicFormField field={formState.getFieldObject('created_at')} />
                <BasicFormField field={formState.getFieldObject('updated_by')} />
                <BasicFormField field={formState.getFieldObject('updated_at')} />   
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