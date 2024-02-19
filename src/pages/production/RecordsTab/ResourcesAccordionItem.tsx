import React from 'react';
import { 
    Button
} from '@chakra-ui/react';

import { useData, DataObject, DataRow } from '../../../providers/data/DataProvider';
import BasicModal from '../../../components/BasicModal/BasicModal';
import MultiStepForm, { MultiStepFormPage } from '../../../components/MultiStepForm/MultiStepForm';
import BasicForm, { BasicFormField } from '../../../components/BasicForm/BasicForm';
import KeywordInput from '../../../components/KeywordInput/KeywordInput';
import VTable, { VTableColumn } from '../../../components/VirtualizedTable/VirtualizedTable';
// import SimpleTagInput from '../../../components/TagBox/SimpleTagInput';


export default function ResourcesAccordionItem() {
    const { 
        fetchData
        , tprod_resourcesUpsert 
        , tprod_resourcesDelete
    } = useData();


    const [resourcesData, setResourcesData] = React.useState<DataObject>();
    const [skillsData, setSkillsData] = React.useState<DataObject>();
    
    const emptyResourceFormState = new DataRow('tprod_resources');
    // const emptyTagFormState = new DataRow('tsys_tags');
    const [state, setState] = React.useState<DataRow>(emptyResourceFormState);
    // const [tag, setTag] = React.useState<DataRow>(emptyTagFormState);
    const [selectedSkills, setSelectedSkills] = React.useState<DataRow[]>([]);
    const [keywords, setKeywords] = React.useState<string[]>([]);
    
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

    async function retrieveKeywords(row: DataRow) {
        const id_resource = row.getField('id').value

        if (id_resource) {
            const { response, data: resourceKeywords } = await fetchData('tsys_keywords', {
                notification: false
                , filters: {
                    and_: {
                        id_object: [id_resource]
                        , type: ['resource']
                    }
                }
            });

            if (response.ok) {
                const newKeywords = resourceKeywords.getArray('keyword');
                setKeywords(newKeywords);
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
        setKeywords([]);
        setState(emptyResourceFormState);
        setMode('create');

        setIsOpen(true);
    }
    
    const handleEditClick = async (row: DataRow) => {
        await retrieveSkills();
        await retrieveSelectedSkills(row);
        await retrieveKeywords(row);
        setState(row);
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

    const handleDeleteClick = async () => {
        const { response, data } = await tprod_resourcesDelete(state);

        if (response.ok) {
            setResourcesData(data);
        }

        setIsOpen(false);
    }

    const handleSaveClick = async () => {

        const { response, data } = await tprod_resourcesUpsert(state, selectedSkills, keywords);
        if (response.ok) {
            setResourcesData(data);
            setIsOpen(false);
        }
    }

    // const handleTagFormSubmit = (row: DataRow) => {
    //     console.log(row);
    //     setTag(row);
    // }



    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
            <span>Catalog, edit or delete resources</span>
            <Button colorScheme="blue" onClick={handleCreateClick}>
                New Resource
            </Button>
        </div>

        {resourcesData && skillsData &&
        <VTable 
            data={resourcesData}
            fillScreen={false}
            onEditClick={handleEditClick} 
            onRefreshClick={handleRefreshClick} 
        >
            <VTableColumn name="name" />
        </VTable>}

        <BasicModal 
            title={mode === 'create' ? 'New Resource' : 'View Resource'}
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
                <MultiStepFormPage title="Resource" description="Agents capable of performing tasks">
                    <BasicForm 
                        row={state}
                        mode={mode}
                        defaultFooter={false}
                        onChange={handleFormOnChange}
                    >
                        <BasicFormField field={state.getField('name')} />
                        <BasicFormField field={state.getField('created_by')} />
                        <BasicFormField field={state.getField('created_at')} />
                        <BasicFormField field={state.getField('updated_by')} />
                        <BasicFormField field={state.getField('updated_at')} />
                    </BasicForm>

                    {/* <SimpleTagInput 
                        mode={mode}
                        onSubmit={handleTagFormSubmit}
                    /> */}
                </MultiStepFormPage>

                <MultiStepFormPage title="Keywords" description="Words that categorize your resource">
                    <KeywordInput className="min-w-120 min-h-10 max-h-72" data={keywords} onSubmit={handleKeywordSubmit} />
                </MultiStepFormPage>


                <MultiStepFormPage title="Skills" description="Abilities that enable a resource to perform tasks">
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