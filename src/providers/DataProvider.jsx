/* Foreign dependencies */
import React, { useState, useContext, createContext } from 'react';

/* Local dependencies */
import { useNotification } from './NotificationProvider';
import { useOverlay } from './OverlayProvider';


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
            maps: `${baseURL}/custom/configs/maps`,
            user: `${baseURL}/custom/configs/user`,
        }
    }
};

export const url = addresses.local;


const DataContext = createContext();
const { Provider } = DataContext;

export function DataProvider({ children }) {

    const overlayContext = useOverlay();
    const { spawnToast, successModel, infoModel, warningModel, errorModel} = useNotification();

    const [unitData, setUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const getState = (objectName) => {
        switch (objectName) {
            case 'units':
                return unitData;
            case 'categories':
                return categoryData;
            default:
                return null;
        }
    };

    const _getStateSetter = (objectName) => {
        switch (objectName) {
            case 'units':
                return setUnitData;
            case 'categories':
                return setCategoryData;
            default:
                return null;
        }    
    };


    /* Methods */
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

        const response = await fetch(url, payload).catch((error) => console.log(error));
        const content = await response.json();

        let model;

        switch (response.status) {
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
            case 200:
                model = successModel;
                model.title = 'Success';
                model.description = content.message;
                break;
            case 422:
                model = errorModel;
                model.title = 'Unprocessable Entity';
                model.description = 'The server could not process the request.';
            default:
                model = errorModel;
                model.title = 'Error';
                model.description = 'An error occurred while processing the request.';
                break;
        }

        if (notification) {
            spawnToast(model);
        }

        if (overlay) await overlayContext.hide();

        return { response, content };
    };

    const customRoute = async (url, payload = {}, notification = true, overlay = true) => {
        const { response, content } = await _makeRequest(url, payload, notification, overlay);
        return { response, content };
    }

    const fetchData = async (tableName, filters = {}, lambdaKwargs = {}, notification = true, overlay = true) => {
        const url = url.crud.select + '?table_name=' + tableName;
        const payload = generatePayload({ 
            method: 'POST'
            , body: JSON.stringify({
                table_name: tableName
                , filters: filters
                , lambda_kwargs: lambdaKwargs
            }) 
        });
            
        const { response, content } = await _makeRequest(url, payload, notification, overlay);

        if(response.status === 200 && content.data !== undefined){
            const stateSetter = _getStateSetter(tableName);
            const json = await JSON.parse(content.data);
            
            if(stateSetter !== null) stateSetter(json); 

            return { response, json }
        }
        
        return { response, json: [] }
    };

    const updateData = async (tableName, id, data, notification = true, overlay = true) => {        
        const url = url.crud.update + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data, id: id}) }); 
        const response = await _makeRequest(url, payload, notification, overlay);
        
        return response
    };

    const deleteData = async (tableName, filters, notification = true, overlay = true) => {
        const url = url.crud.delete + '?table_name=' + tableName;
        const payload = generatePayload({ 
            method: 'DELETE'
            , body: JSON.stringify({
                table_name: tableName,
                filters: filters
            }) 
        });
        const response = await _makeRequest(url, payload, notification, overlay);

        return response
    }

    const submitData = async (tableName, data, notification = true, overlay = true) => {
        const url = url.crud.insert + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({
            data: [data]
            , table_name: tableName
        } )});
        const response = await _makeRequest(url, payload, notification, overlay);

        return response
    }


    return (
        <Provider value={{ getState, customRoute, fetchData, updateData, deleteData, submitData, generatePayload }}>
            {children}
        </Provider>
    );
}

export const useData = () => {
    return useContext(DataContext);
};