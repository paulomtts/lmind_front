import { DataRow } from "../models";
import Connector from "../Connector";


class TSysUnits {
    static url = Connector.addresses.custom.units;

    static insert = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'POST'
            , body: JSON.stringify(state.popEmpties())
        });
    
        const { response, content } = await Connector.request(this.url.insert, payload);
        return Connector.parse(response, content, 'tsys_units');
    }

    static delete = async (state: DataRow) => {
        const payload = Connector.build({
            method: 'DELETE'
            , body: JSON.stringify(state.json)
        });
    
        const { response, content } = await Connector.request(this.url.delete, payload);
        return Connector.parse(response, content, 'tsys_units');
    }
}

export { TSysUnits }