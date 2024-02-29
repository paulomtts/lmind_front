import { DataRow } from "../models";
import { PayloadInterface } from "../interfaces";
import BackendConnector from "../BackendConnector";


class CRUD {
    static url = BackendConnector.addresses.crud;

    static customRoute = async (customURL: string, payload: PayloadInterface, notification = true, overlay = true) => {
        const { response, content } = await BackendConnector.request(customURL, payload, notification, overlay);
        return { response, content };
    }

    static select = async (tableName: string, {filters = {}, lambdaKwargs = {}, notification = true, overlay = true}) => {
        const address = BackendConnector.addresses.crud.select + '?table_name=' + tableName;
        const payload = BackendConnector.build({ 
            method: 'POST'
            , body: JSON.stringify({
                table_name: tableName
                , filters: filters
                , lambda_kwargs: lambdaKwargs
            }) 
        });
            
        const { response, content } = await BackendConnector.request(address, payload, notification, overlay);
        return BackendConnector.parse(response, content, tableName);
    }

    static update = async (tableName: string, id: number, data: DataRow, notification = true, overlay = true) => {    
        const address = BackendConnector.addresses.crud.update + '?table_name=' + tableName;
        const payload = BackendConnector.build({ 
            method: 'POST'
            , body: JSON.stringify({...data.json, id: id}) 
        }); 
        
        const { response, content } = await BackendConnector.request(address, payload, notification, overlay);
        return BackendConnector.parse(response, content, tableName);
    }

    static delete = async (tableName: string, filters: object, notification = true, overlay = true) => {
        const address = BackendConnector.addresses.crud.delete + '?table_name=' + tableName;
        const payload = BackendConnector.build({ 
            method: 'DELETE'
            , body: JSON.stringify({
                table_name: tableName,
                filters: filters
            }) 
        });

        const { response, content } = await BackendConnector.request(address, payload, notification, overlay);
        return BackendConnector.parse(response, content, tableName);
    }

    static insert = async (tableName: string, data: DataRow, notification = true, overlay = true) => {
        const address = BackendConnector.addresses.crud.insert + '?table_name=' + tableName;
        const payload = BackendConnector.build({ 
            method: 'POST'
            , body: JSON.stringify({
                data: [data.popEmpties()]
                , table_name: tableName
            })
        });

        const { response, content } = await BackendConnector.request(address, payload, notification, overlay);
        return BackendConnector.parse(response, content, tableName);
    }
}

export { CRUD }