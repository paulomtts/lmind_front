import React, { useEffect, useState } from 'react';

import VirtualizedTable from '../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject } from '../../providers/data/DataProvider';


export default function UnitsTab() {

    const { fetchData } = useData();

    const initialData = new DataObject('tsys_tags');
    const [data, setData] = useState<DataObject>(initialData);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tsys_tags', {}, {}, false, true);
        
        if (response.ok) {
            setData(newData);
        }
    }


    /* Effects */
    useEffect(() => {
        retrieveData();
    }, []);


    /* Handlers */
    const handleRefreshClick = () => {
        retrieveData();
    }


    return (<div className='flex flex-col gap-4'>

        <div className='flex justify-between items-center mt-2 mb-2'>
            <span>Create, edit and visualize measurement units.</span>
        </div>

        <VirtualizedTable 
            data={data}
            onRefreshClick={handleRefreshClick} 
        />
    </div>)
}