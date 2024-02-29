import React from 'react';

import { useNotification } from '../NotificationProvider';
import { useOverlay } from '../OverlayProvider';
import BackendConnector from './BackendConnector';
import { DataObject, DataRow, DataField } from './models';
import { CRUD } from '../data/routes/CRUD';


const DataContext = React.createContext();
const { Provider } = DataContext;

function DataProvider({ children }) {

    const notificationContext = useNotification();
    const overlayContext = useOverlay();

    React.useRef(new BackendConnector(notificationContext, overlayContext));
        
    const [tsys_categoriesData, setTsys_CategoriesData] = React.useState([]);


    /* Effects */
    React.useEffect(() => {
        fetchData('tsys_categories', {notification: false, overlay: false});
    }, []);

    
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
                return () => {};
        }    
    };

    
    /* Standard Routes */
    const customRoute = async (url, payload = {}, notification = true, overlay = true) => {
        const { response, content } = await BackendConnector.request(url, payload, notification, overlay);
        return { response, content };
    };

    const fetchData = async (tableName, {filters = {}, lambdaKwargs = {}, notification = true, overlay = true}) => {
        const { response, data } = await CRUD.select(tableName, {
            filters: filters
            , lambdaKwargs: lambdaKwargs
            , notification: notification
            , overlay: overlay
        });

        if (response.status === 200 && data !== undefined) {
            const stateSetter = _getStateSetter(tableName);
            stateSetter(data);
        }
        return { response, data }
    };

    const values = {
        getState
        , customRoute
        , fetchData
    }

    return (
        <Provider value={values}>
            {children}
        </Provider>
    );
}


const useData = () => {
    return React.useContext(DataContext);
};


export { DataProvider, useData, DataObject, DataRow, DataField};