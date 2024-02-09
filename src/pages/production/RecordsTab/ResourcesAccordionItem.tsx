import React from 'react';
import { Button } from '@chakra-ui/react';

import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';
import BasicModal from '../../../components/BasicModal/BasicModal';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import SimpleTagBox, { SimpleTag } from '../../../components/TagBox/SimpleTagBox';
import NewTagButton from '../../../components/TagBox/NewTagButton';
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
    const [tags, setTags] = React.useState<string[]>([]);
    
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
            setSkillsData(newData);
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

    
    /* Handlers */
    const handleRefreshClick = () => {
        retrieveResources();
    }

    const handleCreateClick = async () => {
        await retrieveSkills();
        setSelectedSkills([]);
        setState(emptyState);
        setMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = async (row: DataRow) => {
        await retrieveSkills();
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

    const handleSkillSelect = (rows: DataRow[]) => {
        setSelectedSkills(rows);
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

                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-end'>
                            <NewTagButton onClick={() => {}} tagForm={
                                <div>Tag Form</div>
                            }/>
                        </div>
                        <SimpleTagBox randomColors className="max-h-72 min-w-120 max-w-120 min-h-10">
                            <SimpleTag label="Tag 1" onClose={() => {}} />
                            <SimpleTag label="Tag 2" onClose={() => {}} />
                            <SimpleTag label="Tag 3" onClose={() => {}} />
                            <SimpleTag label="Tag 4" onClose={() => {}} />
                            <SimpleTag label="Tag 5" onClose={() => {}} />
                            <SimpleTag label="Tag 6" onClose={() => {}} />
                            <SimpleTag label="Tag 7" onClose={() => {}} />
                            <SimpleTag label="Tag 8" onClose={() => {}} />
                            <SimpleTag label="Tag 9" onClose={() => {}} />
                            <SimpleTag label="Tag 10" onClose={() => {}} />
                            <SimpleTag label="Tag 11" onClose={() => {}} />
                            <SimpleTag label="Tag 12" onClose={() => {}} />
                            <SimpleTag label="Tag 13" onClose={() => {}} />
                            <SimpleTag label="Tag 14" onClose={() => {}} />
                            <SimpleTag label="Tag 15" onClose={() => {}} />
                            <SimpleTag label="Tag 16" onClose={() => {}} />
                            <SimpleTag label="Tag 17" onClose={() => {}} />
                            <SimpleTag label="Tag 18" onClose={() => {}} />
                            <SimpleTag label="Tag 19" onClose={() => {}} />
                            <SimpleTag label="Tag 20" onClose={() => {}} />
                            <SimpleTag label="Tag 21" onClose={() => {}} />
                            <SimpleTag label="Tag 22" onClose={() => {}} />
                        </SimpleTagBox>
                    </div>


                </MultiStepFormPage>

                {/* <MultiStepFormPage title="Tags" description="Help to categorize your resources">
                </MultiStepFormPage> */}


                <MultiStepFormPage title="Skills" description="These tell which tasks your resource is capable of performing">
                    {skillsData && selectedSkills &&
                    <VirtualizedTable 
                        data={skillsData}
                        selectedData={selectedSkills}
                        fillScreen={false}
                        editable={false}
                        refreshable={false}
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