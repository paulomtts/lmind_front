import { DataRow } from "../models";
import Connector from "../Connector";


class TProdSkills {
    static url = Connector.addresses.custom.skills;

    static upsert = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'POST'
            , body: JSON.stringify(state.popEmpties())
        });

        const { response, content } = await Connector.request(TProdSkills.url.upsert, payload);
        return Connector.parse(response, content, 'tprod_skills');
    }

    static delete = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });
    
        const { response, content } = await Connector.request(TProdSkills.url.delete, payload);
        return Connector.parse(response, content, 'tprod_skills');
    }
}


class TProdResources {
    static url = Connector.addresses.custom.resources;

    static upsert = async (state: DataRow, selectedSkills: DataRow[], keywordList: string[]) => {
        const idSkillsList = selectedSkills.map(skill => skill.json.id); 

        const payload = Connector.build({
            method: 'POST'
            , body: JSON.stringify({
                resource: state.popEmpties()
                , id_skill_list: idSkillsList
                , keyword_list: keywordList
            })
        });

        const { response, content } =  await Connector.request(TProdResources.url.upsert, payload, true, true);
        return Connector.parse(response, content, 'tprod_resources');
    }

    static delete = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });

        const { response, content } =  await Connector.request(TProdResources.url.delete, payload, true, true);
        return Connector.parse(response, content, 'tprod_resources');
    }
}


class TProdTasks {
    static url = Connector.addresses.custom.tasks;

    static upsert = async (state: DataRow, selectedSkills: DataRow[], keywordList: string[]) => {
        const idSkillsList = selectedSkills.map(skill => skill.json.id);

        const payload = Connector.build({
            method: 'POST'
            , body: JSON.stringify({
                task: state.popEmpties()
                , id_skill_list: idSkillsList
                , keyword_list: keywordList
            })
        });

        const { response, content } =  await Connector.request(TProdTasks.url.upsert, payload, true, true);
        return Connector.parse(response, content, 'tprod_tasks');
    }

    static delete = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });

        const { response, content } =  await Connector.request(TProdTasks.url.delete, payload, true, true);
        return Connector.parse(response, content, 'tprod_tasks');
    }
}


class TProdProductTags {
    static checkAvailability = async (state) => {
        const payload = Connector.build({
            method: 'POST'
            , body: JSON.stringify({
                category: state.json.category
                , registry_counter: state.json.registry_counter
            })
        });

        const { response, content } =  await Connector.request(Connector.addresses.custom.products.tagCheckAvailability, payload, false, true);

        if (response.ok) {
            const data = JSON.parse(content.data);

            return { response, data };
        }

        return { response, data: [] };
    }
}


export { TProdSkills, TProdResources, TProdTasks, TProdProductTags }