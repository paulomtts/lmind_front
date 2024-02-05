import React, { useEffect, useState } from 'react';
import { Button, Input } from '@chakra-ui/react';

import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';

import MultiStepForm, { MultiStepFormPage } from '../../../components/MultiStepForm/MultiStepForm';



export default function ResourcesAccordionItem() {

    const { 
        fetchData
        , tprod_resourcesUpsert 
        , tprod_resourcesDelete
    } = useData();

    const initialData = new DataObject('tprod_resources');
    const initialState = new DataRow('tprod_resources');

    const [data, setData] = useState<DataObject>(initialData);
    const [formState, setFormState] = useState<DataRow>(initialState);
    const [formMode, setFormMode] = useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = useState(false);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tprod_resources', {}, {}, false);

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
        const { response, data } = await tprod_resourcesUpsert(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_resourcesDelete(formState);

        if (response.ok) {
            setData(data);
        }

        setIsOpen(false);
    }

    const handleOnNext = (activeStep: number) => {
        console.log(`Next clicked from step ${activeStep}`);
        return true;
    }

    const handleOnPrevious = (activeStep: number) => {
        console.log(`Previous clicked from step ${activeStep}`);
        return true;
    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete resources</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Resource
            </Button>
        </div>

        <BasicModal 
            title={formMode === 'create' ? 'New Resource' : 'View Resource'}
            width='60%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >

            <MultiStepForm
                className="bg-slate-100 rounded-md shadow-md border border-slate-300"
                stepperOrientation="vertical" 
                stepperHeight="calc(100vh - 10.6rem)" 
                onNext={handleOnNext} 
                onPrevious={handleOnPrevious}
            >
                <MultiStepFormPage title="Resource" description="Provide information about your resource">
                    <BasicForm 
                        row={formState}
                        mode={formMode}
                        onChange={handleFormOnChange}
                        onSave={handleFormSaveClick}
                        onDelete={handleFormDeleteClick}
                    >
                        <BasicFormField field={formState.getFieldObject('name')} />
                        <BasicFormField field={formState.getFieldObject('created_by')} />
                        <BasicFormField field={formState.getFieldObject('created_at')} />
                        <BasicFormField field={formState.getFieldObject('updated_by')} />
                        <BasicFormField field={formState.getFieldObject('updated_at')} />
                    </BasicForm>
                </MultiStepFormPage>

                <MultiStepFormPage title="Skills" description="These allow your resource to perform tasks">
                    <span>Step 2 content goes here</span>
                </MultiStepFormPage>

                <MultiStepFormPage title="Department" description="Choose a department for your resource">
                    <span>Step 3</span>
                </MultiStepFormPage>
            </MultiStepForm>
        </BasicModal>


        <VirtualizedTable 
            data={data}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />
    </div>)
}