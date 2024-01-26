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

import { DataObject, DataRow } from '../../providers/data/models.js';
import { useVirtualizedList } from '../../hooks/useVirtualizedList.js';
import { Sorter } from './models.js';


export default function TableBody({
    data
    , sorters
    , containerRef
    , displayCallback = () => true
    , onEditClick = () => {}
}: {
    data: DataObject
    
    , sorters: Sorter[]
    , containerRef: React.RefObject<HTMLDivElement>
    , displayCallback?: (row: Record<string, any>) => boolean
    , onEditClick?: (row: DataRow) => void;
}) {

    const rowBuilder = (row: DataRow) => {
        const uuid = v4();

        return <Tr 
            key={uuid}
            className="hover:bg-blue-100 border-t border-solid border-gray-300" 
        >
            <Td padding={'0.25rem 0.25px'} textAlign={'center'}>
                {onEditClick && <Button
                    size='xs' 
                    bg='gray.200' 
                    padding={'0px'} 
                    margin={'0px'} 
                    className='border border-solid border-gray-400'
                    isDisabled={row.json['created_by'] === 'system'}
                    onClick={() => onEditClick(row)}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </Button>}
            </Td>

            {row.getVisibleFields().map((field) => {
                return <Td key={field.label}>{String(field.value)}</Td>
            })}
        </Tr>
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data.rows, rowBuilder, displayCallback, containerRef, [sorters], 32, 10, 5);

    return (<>
        <Tbody>
            <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <tr key={`option-post`} style={{height: `${postHeight}px`}} />
        </Tbody>
    </>);
}