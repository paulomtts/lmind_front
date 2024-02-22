import React, { useEffect, useState } from 'react';

import VTable, { VTableColumn } from '../../components/VirtualizedTable/VirtualizedTable';
import { useData, DataObject } from '../../providers/data/DataProvider';


export default function UnitsTab() {

    const { fetchData } = useData();

    const initialData = new DataObject('tsys_tags');
    const [data, setData] = useState<DataObject>(initialData);


    /* Methods */
    async function retrieveData() {
        const { response, data: newData } = await fetchData('tsys_tags', {notification: false});
        
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

        <VTable 
            data={data}
            onRefreshClick={handleRefreshClick} 
        >
            <VTableColumn name='code_a' />
            <VTableColumn name='counter_a' />  
            <VTableColumn name='code_b' />
            <VTableColumn name='counter_b' />
            <VTableColumn name='code_c' />
            <VTableColumn name='counter_c' />
            <VTableColumn name='code_d' />
            <VTableColumn name='counter_d' />
            <VTableColumn name='code_e' />
            <VTableColumn name='counter_e' />
            <VTableColumn name='type' />
        </VTable>
    </div>)
}