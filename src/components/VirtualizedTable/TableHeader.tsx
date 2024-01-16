import React from 'react';
import {
    Thead,
    Tr,
    Th,
    Box,
} from '@chakra-ui/react'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sorter } from './models';


export default function TableHeader({
    sorters,
    onSortClick,
}: {
    sorters: Sorter[],
    onSortClick: (targetSorter: Sorter) => void,
}) {

    const getIcon = (direction: string) => {
        if (direction === 'asc') return faSortUp;
        else if (direction === 'desc') return faSortDown;
        else return faSort;
    }

    return (<>
        <Thead>
            <Tr>
                <Th w={0} />

                {sorters.map((sort) => {
                    const icon = getIcon(sort.direction);

                    return <Th key={sort.label}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <span className='select-none'>{sort.label}</span>
                            <FontAwesomeIcon 
                                icon={icon}
                                className='cursor-pointer'
                                onClick={() => onSortClick(sort)}
                            />
                        </Box>
                    </Th>
                })}
            </Tr>
        </Thead>
    </>);
}