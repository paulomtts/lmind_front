import { DataRow } from "../models";
import BackendConnector from "../BackendConnector";


class TSysUnits {
    static url = BackendConnector.addresses.custom.units;

    static insert = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'POST'
            , body: JSON.stringify(state.popEmpties())
        });
    
        const { response, content } = await BackendConnector.request(TSysUnits.url.insert, payload);
        return BackendConnector.parse(response, content, 'tsys_units');
    }

    static delete = async (state: DataRow) => {
        const payload = BackendConnector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });
    
        const { response, content } = await BackendConnector.request(TSysUnits.url.delete, payload);
        return BackendConnector.parse(response, content, 'tsys_units');
    }
}

export { TSysUnits }