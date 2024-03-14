import Toast from "../NotificationProvider";
import { 
    PayloadInterface
    , NotificationProviderInterface
    , OverlayProviderInterface 
} from "./interfaces";
import { DataObject } from "./models";

const addresses = (baseURL: string) => {
    return {
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
            products: {
                tagCheckAvailability: `${baseURL}/tprod/products/tag-check-availability`
            },
            routes: {
                upsert: `${baseURL}/tprod/routes/upsert`,
                delete: `${baseURL}/tprod/routes/delete`,
            }
        }
    }
};

export default class Connector {
    static addresses = addresses('http://localhost:8000');    
    static notification: NotificationProviderInterface;
    static overlay: OverlayProviderInterface;

    constructor(notification: NotificationProviderInterface, overlay: OverlayProviderInterface) {
        Connector.notification = notification;
        Connector.overlay = overlay;
    }

    static build ({
        method = 'GET'
        , credentials = 'include'
        , headers = {'Content-Type': 'application/json'}
        , body
    }) {
        return {
            method: method,
            credentials: credentials,
            headers: headers,
            body: body,
        }
    };

    static async request (url: string, payload: PayloadInterface, showNotification: boolean = true, showOverlay: boolean = true) {
        if (showOverlay) Connector.overlay?.show();

        const response = await fetch(url, payload as RequestInit);
        const content = await response.json();

        let toast: Toast;

        switch (response.status) {
            case 200:
                toast = new Toast('Success', content.message, Toast.success);
                break;
            case 204:
                toast = new Toast('No Content', 'The resource was found but had no data stored.', Toast.warning);
                break;
            case 304:
                toast = new Toast('Not Modified', 'You made no changes to the resource.', Toast.info);
                break;
            case 422:
                toast = new Toast('Unprocessable Request', 'Your request did not meet the requirements.', Toast.error);    
                break;
            default:
                toast = new Toast('Error', content.message || content.detail, Toast.error);
                break;
        }

        if (showNotification) Connector.notification?.spawn(toast);
        if (showOverlay) Connector.overlay?.hide();

        return { response: response, content: content };
    };

    static parse = (response: Response, content: any, tableName: string) => {
        if (response.ok) {
            const json = JSON.parse(content.data);
            const data = new DataObject(tableName, json);
    
            return { response, data };
        }
    
        return { response, data: new DataObject(tableName) };
    }
}