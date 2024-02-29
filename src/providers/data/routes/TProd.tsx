import { DataRow } from "../models";
import BackendConnector from "../BackendConnector";


class TProdSkills {
    static url = BackendConnector.addresses.custom.skills;

    static upsert = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'POST'
            , body: JSON.stringify(state.popEmpties())
        });

        const { response, content } = await BackendConnector.request(TProdSkills.url.upsert, payload);
        return BackendConnector.parse(response, content, 'tprod_skills');
    }

    static delete = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });
    
        const { response, content } = await BackendConnector.request(TProdSkills.url.delete, payload);
        return BackendConnector.parse(response, content, 'tprod_skills');
    }
}


class TProdResources {
    static url = BackendConnector.addresses.custom.resources;

    static upsert = async (state: DataRow, selectedSkills: DataRow[], keywordList: string[]) => {
        const idSkillsList = selectedSkills.map(skill => skill.json.id); 

        const payload = BackendConnector.build({
            method: 'POST'
            , body: JSON.stringify({
                resource: state.popEmpties()
                , id_skill_list: idSkillsList
                , keyword_list: keywordList
            })
        });

        const { response, content } =  await BackendConnector.request(TProdResources.url.upsert, payload, true, true);
        return BackendConnector.parse(response, content, 'tprod_resources');
    }

    static delete = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });

        const { response, content } =  await BackendConnector.request(TProdResources.url.delete, payload, true, true);
        return BackendConnector.parse(response, content, 'tprod_resources');
    }
}


class TProdTasks {
    static url = BackendConnector.addresses.custom.tasks;

    static upsert = async (state: DataRow, selectedSkills: DataRow[], keywordList: string[]) => {
        const idSkillsList = selectedSkills.map(skill => skill.json.id);

        const payload = BackendConnector.build({
            method: 'POST'
            , body: JSON.stringify({
                task: state.popEmpties()
                , id_skill_list: idSkillsList
                , keyword_list: keywordList
            })
        });

        const { response, content } =  await BackendConnector.request(TProdTasks.url.upsert, payload, true, true);
        return BackendConnector.parse(response, content, 'tprod_tasks');
    }

    static delete = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });

        const { response, content } =  await BackendConnector.request(TProdTasks.url.delete, payload, true, true);
        return BackendConnector.parse(response, content, 'tprod_tasks');
    }
}


class TProdProductTags {
    static checkAvailability = async (state) => {
        const payload = BackendConnector.build({
            method: 'POST'
            , body: JSON.stringify({
                category: state.json.category
                , registry_counter: state.json.registry_counter
            })
        });

        const { response, content } =  await BackendConnector.request(BackendConnector.addresses.custom.products.tagCheckAvailability, payload, false, true);

        if (response.ok) {
            const data = JSON.parse(content.data);

            return { response, data };
        }

        return { response, data: [] };
    }
}


export { TProdSkills, TProdResources, TProdTasks, TProdProductTags }