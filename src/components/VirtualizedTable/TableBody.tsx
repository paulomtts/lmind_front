import React from 'react';
import {
    Tbody
    , Tr
    , Td
    , Button
    , Checkbox
} from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { v4 } from 'uuid';

import { DataObject, DataRow } from '../../providers/data/models.js';
import { useVirtualizedList } from '../../hooks/useVirtualizedList.js';
import { Sorter } from './models.js';


export default function TableBody({
    data
    , selectedData
    , sorters
    , containerRef
    , editable
    , selectable
    , displayCallback = () => true
    , onEditClick = undefined
    , onSelectClick = undefined
}: {
    data: DataObject
    selectedData?: DataRow[];
    sorters: Sorter[];
    containerRef: React.RefObject<HTMLDivElement>;
    editable?: boolean;
    selectable?: boolean;
    displayCallback?: (row: Record<string, any>) => boolean;
    onEditClick?: (row: DataRow) => void;
    onSelectClick?: (row: DataRow) => void;
}) {

    const handleEditClick = (row: DataRow) => {
        if (!onEditClick) return;
        onEditClick(row);
    }

    const handleSelectClick = (row: DataRow) => {
        if (!onSelectClick) return;
        onSelectClick(row);
    }

    const rowBuilder = (row: DataRow) => {
        const uuid = v4();

        return <Tr 
            key={uuid}
            className="hover:bg-blue-100 border-t border-solid border-gray-300" 
        >
            {editable &&<Td>
                <Button
                    size='xs' 
                    bg='gray.200' 
                    padding={'0px'} 
                    margin={'0px'} 
                    className='border border-solid border-gray-400'
                    isDisabled={row.json['created_by'] === 'system'}
                    onClick={() => handleEditClick(row)}
                    >
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
            </Td>}

            {selectable && <Td>
                <Checkbox 
                    border={'1px solid #CBD5E0'}
                    colorScheme="blue"
                    defaultChecked={selectedData?.some((selectedRow) => selectedRow.isEqual(row))}
                    onChange={() => handleSelectClick(row)}
                />
            </Td>}

            {row.getVisible('read').map((field) => {
                return <Td key={field.label} className='text-wrap'>{String(field.value)}</Td>
            })}
        </Tr>
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data.rows, rowBuilder, displayCallback, containerRef, [sorters, selectedData], 32, 10, 5);

    return (<>
        <Tbody>
            <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />
            {visibleData}
            <tr key={`option-post`} style={{height: `${postHeight}px`}} />
        </Tbody>
    </>);
}