import React from 'react';
import { Button } from '@chakra-ui/react';

import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';
import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import VirtualizedTable from '../../../components/VirtualizedTable/VirtualizedTable';
import MultiStepForm, { MultiStepFormPage } from '../../../components/MultiStepForm/MultiStepForm';


export default function ResourcesAccordionItem() {
    const { 
        fetchData
        , tprod_resourcesUpsert 
        , tprod_resourcesDelete
    } = useData();


    const [resourcesData, setResourcesData] = React.useState<DataObject>();
    
    const emptyState = new DataRow('tprod_resources');
    const [state, setState] = React.useState<DataRow>(emptyState);
    
    const [skillsData, setSkillsData] = React.useState<DataObject>();
    const [selectedSkills, setSelectedSkills] = React.useState<DataRow[]>([]);
    
    const [mode, setMode] = React.useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = React.useState(false);


    /* Methods */
    async function retrieveResources() {
        const { response, data: newData } = await fetchData('tprod_resources', {notification: false});

        if (response.ok) {
            setResourcesData(newData);
        }
    }

    async function retrieveSkills() {
        const { response: dataResponse, data: newData } = await fetchData('tprod_skills', {notification: false});

        if (dataResponse.ok) {
            setSkillsData((prev) => newData);
        }
    }

    async function retrieveSelectedSkills(row: DataRow) {
        const id_resource = row.getField('id').value

        if (id_resource) {
            const { response, data: resourceSkills } = await fetchData('tprod_resourceskills', {
                notification: false
                , filters: {
                    and_: {
                        id_resource: [id_resource]
                    }
                }
            });

            if (response.ok && skillsData) {
                const idList = resourceSkills.getArray('id_skill');
                const newSelectedSkills = skillsData.rows.filter((r: DataRow) => idList.includes(r.getField('id').value));
                setSelectedSkills(newSelectedSkills);
            }
        }
    }


    /* Effects */
    React.useEffect(() => {
        retrieveResources();
        retrieveSkills();
    }, []);

    React.useEffect(() => {
        if (isOpen === false) return;
        // retrieveSkills();
        
    }, [isOpen]);


    /* Handlers */
    const handleRefreshClick = () => {
        retrieveResources();
    }

    const handleCreateClick = () => {
        setSelectedSkills([]);
        setState(emptyState);
        setMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = async (row: DataRow) => {
        await retrieveSelectedSkills(row);
        setState(row);
        setMode('update');

        setIsOpen(true);
    }

    const handleFormOnChange = (newState: DataRow) => {
        setState(newState);
    }

    const handleFormSaveClick = async () => {
        const { response, data } = await tprod_resourcesUpsert(state);

        if (response.ok) {
            setResourcesData(data);
        }

        setIsOpen(false);
    }

    const handleFormDeleteClick = async () => {
        const { response, data } = await tprod_resourcesDelete(state);

        if (response.ok) {
            setResourcesData(data);
        }

        setIsOpen(false);
    }

    const handleSkillSelect = (row: DataRow) => {
        setSelectedSkills((prevSelectedSkills) => {
            const index = prevSelectedSkills.findIndex((r) => r.isEqual(row));
            if (index > -1) {
                return prevSelectedSkills.filter((_, i) => i !== index);
            } else {

                return [...prevSelectedSkills, row];
            }
        });
    }

    const handleSaveClick = async () => {
        const { response, data } = await tprod_resourcesUpsert(state, selectedSkills);

        if (response.ok) {
            setResourcesData(data);
            setIsOpen(false);
        }
    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete resources</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Resource
            </Button>
        </div>

        <BasicModal 
            title={mode === 'create' ? 'New Resource' : 'View Resource'}
            width='80%'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >

            <MultiStepForm
                stepperOrientation="vertical" 
                stepperHeight="calc(100vh - 16.6rem)" 
                onSave={handleSaveClick}
            >
                <MultiStepFormPage title="Resource" description="Productive agents capable of performing tasks">
                    <BasicForm 
                        row={state}
                        mode={mode}
                        defaultFooter={false}
                        onChange={handleFormOnChange}
                        onSave={handleFormSaveClick}
                        onDelete={handleFormDeleteClick}
                    >
                        <BasicFormField field={state.getField('name')} />
                        <BasicFormField field={state.getField('created_by')} />
                        <BasicFormField field={state.getField('created_at')} />
                        <BasicFormField field={state.getField('updated_by')} />
                        <BasicFormField field={state.getField('updated_at')} />
                    </BasicForm>
                </MultiStepFormPage>

                <MultiStepFormPage title="Skills" description="These tell which tasks your resource is capable of performing">
                    {skillsData && selectedSkills &&
                    <VirtualizedTable 
                        data={skillsData}
                        selectedData={selectedSkills}
                        fillScreen={false}
                        editable={false}
                        selectable={true}
                        onSelectClick={handleSkillSelect}
                        onRefreshClick={handleRefreshClick} 
                    />}
                </MultiStepFormPage>
            </MultiStepForm>
        </BasicModal>

        {resourcesData && skillsData &&
        <VirtualizedTable 
            data={resourcesData}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        />}
    </div>)
}