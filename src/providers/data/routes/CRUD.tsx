import { DataRow } from "../models";
import { PayloadInterface } from "../interfaces";
import Connector from "../Connector";


class CRUD {
    static url = Connector.addresses.crud;

    static customRoute = async (customURL: string, payload: PayloadInterface, notification = true, overlay = true) => {
        const { response, content } = await Connector.request(customURL, payload, notification, overlay);
        return { response, content };
    }

    static select = async (tableName: string, {filters = {}, lambdaKwargs = {}, notification = true, overlay = true} = {}) => {
        const address = Connector.addresses.crud.select + '?table_name=' + tableName;
        const payload = Connector.build({ 
            method: 'POST'
            , body: JSON.stringify({
                table_name: tableName
                , filters: filters
                , lambda_kwargs: lambdaKwargs
            }) 
        });
            
        const { response, content } = await Connector.request(address, payload, notification, overlay);
        return Connector.parse(response, content, tableName);
    }

    static update = async (tableName: string, id: number, data: DataRow, notification = true, overlay = true) => {    
        const address = Connector.addresses.crud.update + '?table_name=' + tableName;
        const payload = Connector.build({ 
            method: 'POST'
            , body: JSON.stringify({...data.json, id: id}) 
        }); 
        
        const { response, content } = await Connector.request(address, payload, notification, overlay);
        return Connector.parse(response, content, tableName);
    }

    static delete = async (tableName: string, filters: object, notification = true, overlay = true) => {
        const address = Connector.addresses.crud.delete + '?table_name=' + tableName;
        const payload = Connector.build({ 
            method: 'DELETE'
            , body: JSON.stringify({
                table_name: tableName,
                filters: filters
            }) 
        });

        const { response, content } = await Connector.request(address, payload, notification, overlay);
        return Connector.parse(response, content, tableName);
    }

    static insert = async (tableName: string, data: DataRow, notification = true, overlay = true) => {
        const address = Connector.addresses.crud.insert + '?table_name=' + tableName;
        const payload = Connector.build({ 
            method: 'POST'
            , body: JSON.stringify({
                data: [data.popEmpties()]
                , table_name: tableName
            })
        });

        const { response, content } = await Connector.request(address, payload, notification, overlay);
        return Connector.parse(response, content, tableName);
    }
}

export { CRUD }