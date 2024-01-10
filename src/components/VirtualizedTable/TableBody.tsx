import React from 'react';
import {
    Tbody,
    Tr,
    Td,
    Button,
} from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { v4 } from 'uuid';

import { FormField } from "../BasicForm/models.js"
import { useVirtualizedList } from '../../hooks/useVirtualizedList.js';
import { Sorter } from './models.js';


export default function TableBody({
    data
    , containerRef
    , sorters
    , displayCallback = () => true
    , onClickRow = () => {}
}: {
    data: Record<string, string | number | boolean>[]
    , containerRef: React.MutableRefObject<HTMLDivElement>
    , sorters: Sorter[]
    , displayCallback?: (row: Record<string, any>) => boolean
    onClickRow?: (row: FormField[]) => void;
}) {

    const handleClickRow = (row: Record<string, string | number | boolean>) => {
        const newFields = Object.entries(row).map(([key, value]) => {
            return new FormField(key, value, true);
        });

        onClickRow(newFields);
    }

    const rowBuilder = (row: Record<string, any>) => {
        const uuid = v4();

        return <Tr 
            key={uuid}
            className="hover:bg-blue-100" 
            style={{borderBottom: '1px solid lightgray'}}
        >
            <Td padding={'0.25rem 0.25px'} textAlign={'center'}>
                <Button 
                    size='xs' 
                    bg='gray.200' 
                    padding={'0px'} 
                    margin={'0px'} 
                    className='border border-solid border-gray-400' 
                    onClick={() => handleClickRow(row)}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
            </Td>
            {Object.keys(row).map((key) => {
                return <Td  key={key}>{row[key]}</Td>
            })}
        </Tr>
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data, rowBuilder, displayCallback, containerRef, [data, sorters]);


    return (<>
        <Tbody>
            <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <tr key={`option-post`} style={{height: `${postHeight}px`}} />
        </Tbody>
    </>);
}