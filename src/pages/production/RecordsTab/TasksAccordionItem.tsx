import React from 'react';
import { Button } from '@chakra-ui/react';

import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';
import BasicModal from '../../../components/BasicModal/BasicModal';
import MultiStepForm, { MultiStepFormPage } from '../../../components/MultiStepForm/MultiStepForm';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import KeywordInput from '../../../components/KeywordInput/KeywordInput';
import VTable, { VTableColumn } from '../../../components/VirtualizedTable/VirtualizedTable';



export default function TasksAccordionItem() {

    const { 
        fetchData
        , tprod_tasksUpsert
        , tprod_tasksDelete
    } = useData();

    const emptyTaskFormState = new DataRow('tprod_tasks');

    const [tasksData, setTasksData] = React.useState<DataObject>();
    const [state, setState] = React.useState<DataRow>(emptyTaskFormState);
    const [keywords, setKeywords] = React.useState<string[]>([]);

    const [skillsData, setSkillsData] = React.useState<DataObject>();
    const [selectedSkills, setSelectedSkills] = React.useState<DataRow[]>([]);

    const [mode, setMode] = React.useState<'create' | 'update'>('create');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);


    /* Methods */
    async function retrieveTasks() {
        const { response, data: newData } = await fetchData('tprod_tasks', {notification: false});

        if (response.ok) {
            setTasksData(newData);
        }
    }

    async function retrieveSkills() {
        const { response: dataResponse, data: newData } = await fetchData('tprod_skills', {notification: false});

        if (dataResponse.ok) {
            setSkillsData(newData);
        }
    }

    async function retrieveSelectedSkills(row: DataRow) {
        const id_task = row.getField('id').value

        if (id_task) {
            const { response, data: taskSkills } = await fetchData('tprod_taskskills', {
                notification: false
                , filters: {
                    and_: {
                        id_task: [id_task]
                    }
                }
            });

            if (response.ok && skillsData) {
                const idList = taskSkills.getArray('id_skill');
                const newSelectedSkills = skillsData.rows.filter((r: DataRow) => idList.includes(r.getField('id').value));
                setSelectedSkills(newSelectedSkills);
            }
        }
    }

    async function retrieveKeywords(row: DataRow) {
        const id_task = row.getField('id').value

        if (id_task) {
            const { response, data: taskKeywords } = await fetchData('tsys_keywords', {
                notification: false
                , filters: {
                    and_: {
                        id_object: [id_task]
                        , type: ['task']
                    }
                }
            });

            if (response.ok) {
                const newKeywords = taskKeywords.getArray('keyword');
                setKeywords(newKeywords);
            }
        }
    }


    /* Effects */
    React.useEffect(() => {
        retrieveTasks();
        retrieveSkills();
    }, []);


    /* Handlers */
    const handleRefreshClick = () => {
        retrieveTasks();
    }

    const handleCreateClick = async () => {
        const field = emptyTaskFormState.getField('id_unit');

        if (field) {
            const { data } = await fetchData('tsys_units', {
                filters: field.props.filters
                , lambdaKwargs: {type: 'time'}
                , notification: false
                , overlay: false
            });
            field.props.data = data;
        }

        await retrieveTasks();
        setSelectedSkills([]);
        setKeywords([]);
        setState(emptyTaskFormState);
        setMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = async (newState: DataRow) => {
        await retrieveSkills();
        await retrieveSelectedSkills(newState);
        await retrieveKeywords(newState);
        setState(newState);
        setMode('update');

        setIsOpen(true);
    }

    const handleFormOnChange = (newState: DataRow) => {
        setState(newState);
    }

    const handleKeywordSubmit = (keywords: string[]) => {
        setKeywords(keywords);
    }

    const handleSkillSelect = (rows: DataRow[]) => {
        setSelectedSkills(rows);
    }

    const handleSaveClick = async () => {
        const { response, data } = await tprod_tasksUpsert(state, selectedSkills, keywords);
        if (response.ok) {
            setTasksData(data);
            setIsOpen(false);
        }
    }

    const handleDeleteClick = async () => {
        const { response, data } = await tprod_tasksDelete(state);

        if (response.ok) {
            setTasksData(data);
            setIsOpen(false);
        }

    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete tasks</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Task
            </Button>
        </div>

        {tasksData && skillsData && <VTable 
            data={tasksData}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        >
            <VTableColumn name='name' />
            <VTableColumn name='description' />
            <VTableColumn name='duration' />
            <VTableColumn name='unit' />
            <VTableColumn name='interruptible' />
            <VTableColumn name='error_margin' />
        </VTable>}

        <BasicModal 
            title={mode === 'create' ? 'New Task' : 'View Task'}
            width='80vw'
            height='80vh'
            blur
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <MultiStepForm 
                onSave={handleSaveClick}
                onDelete={mode === 'update' ? handleDeleteClick : undefined}
            >
                <MultiStepFormPage title='Task' description='The smallest unit of work'>
                    <div style={{maxHeight: '67vh', height: 'fit-content'}} className='overflow-y-auto pr-2'>
                        <BasicForm 
                            row={state}
                            mode={mode}
                            defaultFooter={false}
                            onChange={handleFormOnChange}
                        >
                            <BasicFormField field={state.getField('name')} />
                            <BasicFormField field={state.getField('description')} />
                            <BasicFormField field={state.getField('duration')} />
                            <BasicFormField field={state.getField('id_unit')} />
                            <BasicFormField field={state.getField('interruptible')} />
                            <BasicFormField field={state.getField('error_margin')} />
                            <BasicFormField field={state.getField('created_by')} />  
                            <BasicFormField field={state.getField('created_at')} />
                            <BasicFormField field={state.getField('updated_by')} />
                            <BasicFormField field={state.getField('updated_at')} />
                        </BasicForm>
                    </div>
                </MultiStepFormPage>

                <MultiStepFormPage title="Keywords" description="Words that categorize your task">
                    <KeywordInput className="min-w-120 min-h-10 max-h-72" data={keywords} onSubmit={handleKeywordSubmit} />
                </MultiStepFormPage>

                <MultiStepFormPage title="Skills" description="Abilities required to perform a task">
                    {skillsData && selectedSkills &&
                    <VTable 
                        data={skillsData}
                        selectedData={selectedSkills}
                        fillScreen={false}
                        editable={false}
                        refreshable={false}
                        selectable={true}
                        onSelectClick={handleSkillSelect}
                        onRefreshClick={handleRefreshClick} 
                    >
                        <VTableColumn name="name" />
                        <VTableColumn name="description" />    
                    </VTable>}
                </MultiStepFormPage>
            </MultiStepForm>
        </BasicModal>
    </div>)
}