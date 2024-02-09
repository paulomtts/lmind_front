import React, { useState, useContext, createContext } from 'react';

import { useNotification } from '../NotificationProvider';
import { useOverlay } from '../OverlayProvider';
import { DataObject, DataRow, DataField } from './models';


const baseURL = false ? 'some.address' : 'http://localhost:8000';
const addresses = {
    local: {
        health: `${baseURL}/health`,
        auth: {
            login: `${baseURL}/auth/login`,
            validate: `${baseURL}/auth/validate`,
            logout: `${baseURL}/auth/logout`,
        },
        crud: {
            select: `${baseURL}/crud/select`,
            insert: `${baseURL}/crud/insert`,
            update: `${baseURL}/crud/update`,
            delete: `${baseURL}/crud/delete`,
        },
        custom: {
            user: `${baseURL}/tsys/users/me`,
            units: {
                insert: `${baseURL}/tsys/units/insert`,
                delete: `${baseURL}/tsys/units/delete`,
            },
            skills: {
                upsert: `${baseURL}/tprod/skills/upsert`,
                delete: `${baseURL}/tprod/skills/delete`,
            },
            resources: {
                upsert: `${baseURL}/tprod/resources/upsert`,
                delete: `${baseURL}/tprod/resources/delete`,
            },
            tasks: {
                upsert: `${baseURL}/tprod/tasks/upsert`,
                delete: `${baseURL}/tprod/tasks/delete`,
            },
        }
    }
};
const url = addresses.local;


const DataContext = createContext();
const { Provider } = DataContext;

function DataProvider({ children }) {

    const overlayContext = useOverlay();
    const { spawnToast, successModel, infoModel, warningModel, errorModel} = useNotification();

    const [tsys_categoriesData, setTsys_CategoriesData] = useState([]);

    
    /* Methods */
    const getState = (objectName) => {
        switch (objectName) {
            case 'tsys_categories':
                return tsys_categoriesData;
            default:
                return null;
        }
    };

    const _getStateSetter = (objectName) => {
        switch (objectName) {
            case 'tsys_categories':
                return setTsys_CategoriesData;
            default:
                return null;
        }    
    };

    function generatePayload({method = 'GET', credentials = 'include', headers = {'Content-Type': 'application/json'}, body = null}) {
        return {
            method: method,
            credentials: credentials,
            headers: headers,
            body: body,
        }
    };

    const _makeRequest = async (url, payload, notification, overlay) => {
        if (overlay) await overlayContext.show();

        const response = await fetch(url, payload);
        const content = await response.json();

        let model;

        switch (response.status) {
            case 200:
                model = successModel;
                model.title = 'Success';
                model.description = content.message;
                break;
            case 204:
                model = warningModel;
                model.title = 'No Content';
                model.description = 'The resource was found but had no data stored.';
                break;
            case 304:
                model = infoModel;
                model.title = 'Not Modified';
                model.description = 'You made no changes to the resource.';
                break;
            case 422:
                model = errorModel;
                model.title = 'Unprocessable Entity';
                model.description = 'The server could not process the request.';
                break;
            default:
                model = errorModel;
                model.title = 'Error';
                model.description = content.message || content.detail;
                break;
        }

        if (notification) {
            spawnToast(model);
        }

        if (overlay) await overlayContext.hide();

        return { response, content };
    };

    
    /* Standard Routes */
    const customRoute = async (url, payload = {}, notification = true, overlay = true) => {
        const { response, content } = await _makeRequest(url, payload, notification, overlay);
        return { response, content };
    }

    const fetchData = async (tableName, {filters = {}, lambdaKwargs = {}, notification = true, overlay = true}) => {
        const address = url.crud.select + '?table_name=' + tableName;
        const payload = generatePayload({ 
            method: 'POST'
            , body: JSON.stringify({
                table_name: tableName
                , filters: filters
                , lambda_kwargs: lambdaKwargs
            }) 
        });
            
        const { response, content } = await _makeRequest(address, payload, notification, overlay);

        if(response.status === 200 && content.data !== undefined){
            const stateSetter = _getStateSetter(tableName);
            const json = JSON.parse(content.data);
            const data = new DataObject(tableName, json);

            if(stateSetter !== null) stateSetter(data); 

            return { response, data }
        }

        return { response, data: [] }
    };

    const updateData = async (tableName, id, data, notification = true, overlay = true) => {    
        
        const address = url.crud.update + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data.json, id: id}) }); 
        const response = await _makeRequest(address, payload, notification, overlay);
        
        return response
    };

    const deleteData = async (tableName, filters, notification = true, overlay = true) => {
        const address = url.crud.delete + '?table_name=' + tableName;
        const payload = generatePayload({ 
            method: 'DELETE'
            , body: JSON.stringify({
                table_name: tableName,
                filters: filters
            }) 
        });
        const response = await _makeRequest(address, payload, notification, overlay);

        return response
    }

    const submitData = async (tableName, data, notification = true, overlay = true) => {
        const address = url.crud.insert + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({
            data: [data.popEmpties()]
            , table_name: tableName
        } )});
        const response = await _makeRequest(address, payload, notification, overlay);

        return response
    }


    /* Routes */

        // TSYS
        const tsys_unitsInsert = async (state) => {
            const payload = generatePayload({
                method: 'POST'
                , body: JSON.stringify(state.popEmpties())
            });

            const { response, content } =  await _makeRequest(url.custom.units.insert, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tsys_units', json);

                return { response, data };
            }

            return { response, data: [] };
        }

        const tsys_unitsDelete = async (state) => {
            const payload = generatePayload({
                method: 'DELETE'
                , body: JSON.stringify(state.json)
            });

            const { response, content } =  await _makeRequest(url.custom.units.delete, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tsys_units', json);

                return { response, data };
            }

            return { response, data: [] };
        }


        // TPROD
        const tprod_skillsUpsert = async (state) => {
            const payload = generatePayload({
                method: 'POST'
                , body: JSON.stringify(state.popEmpties())
            });

            const { response, content } =  await _makeRequest(url.custom.skills.upsert, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_skills', json);

                return { response, data };
            }

            return { response, data: [] };
        }

        const tprod_skillsDelete = async (state) => {
            const payload = generatePayload({
                method: 'DELETE'
                , body: JSON.stringify(state.json)
            });

            const { response, content } =  await _makeRequest(url.custom.skills.delete, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_skills', json);

                return { response, data };
            }

            return { response, data: [] };
        }


        const tprod_resourcesUpsert = async (state, selectedSkills) => {
            const idSkillsList = selectedSkills.map(skill => skill.json.id); 

            const payload = generatePayload({
                method: 'POST'
                , body: JSON.stringify({
                    resource: state.popEmpties()
                    , id_skill_list: idSkillsList}
                )
            });

            const { response, content } =  await _makeRequest(url.custom.resources.upsert, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_resources', json);

                return { response, data };
            }

            return { response, data: [] };
        }

        const tprod_resourcesDelete = async (state) => {
            const payload = generatePayload({
                method: 'DELETE'
                , body: JSON.stringify(state.json)
            });

            const { response, content } =  await _makeRequest(url.custom.resources.delete, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_resources', json);

                return { response, data };
            }

            return { response, data: [] };
        }


        const tprod_tasksUpsert = async (state) => {
            const payload = generatePayload({
                method: 'POST'
                , body: JSON.stringify(state.popEmpties())
            });

            const { response, content } =  await _makeRequest(url.custom.tasks.upsert, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_tasks', json);

                return { response, data };
            }

            return { response, data: [] };
        }

        const tprod_tasksDelete = async (state) => {
            const payload = generatePayload({
                method: 'DELETE'
                , body: JSON.stringify(state.json)
            });

            const { response, content } =  await _makeRequest(url.custom.tasks.delete, payload, true, true);

            if (response.ok) {
                const json = JSON.parse(content.data);
                const data = new DataObject('tprod_tasks', json);

                return { response, data };
            }

            return { response, data: [] };
        }


    /* Effects */
    React.useEffect(() => {
        fetchData('tsys_categories', {notification: false, overlay: false});
    }, []);


    const values = {
        getState
        , generatePayload
        
        , customRoute
        , fetchData
        , updateData
        , deleteData
        , submitData

        , tsys_unitsInsert
        , tsys_unitsDelete

        , tprod_skillsUpsert
        , tprod_skillsDelete
        , tprod_resourcesUpsert
        , tprod_resourcesDelete
        , tprod_tasksUpsert
        , tprod_tasksDelete
    }

    return (
        <Provider value={values}>
            {children}
        </Provider>
    );
}


const useData = () => {
    return useContext(DataContext);
};

export { DataProvider, url, useData, DataObject, DataRow, DataField};