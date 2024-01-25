import React from "react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Box,

} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { faChevronDown, faRefresh, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import BasicInput from "../BasicInput/BasicInput";
import BasicPopover from "../BasicPopover/BasicPopover";
import FilterBox from "./FilterBox";
import { Filter } from "./models";


export default function TableToolbar({
    labels,
    filters,
    searchIn,
    searchFor,
    onSearchInClick,
    onSearchForChange,
    onRefreshClick,
    onChangeFilters,
}: {
    labels: string[]
    , filters: Filter[]
    , searchIn: string
    , searchFor: string
    , onSearchInClick: (event: React.MouseEvent<HTMLElement>) => void
    , onSearchForChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    , onRefreshClick: (event: React.MouseEvent<HTMLElement>) => void
    , onChangeFilters: (filters: Filter[]) => void
}) {

    const filterPopoverContent = <FilterBox filters={filters} onChangeFilters={onChangeFilters}/>;

    const handleClearClick = () => {
        onSearchForChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }

    return (<Box display={'flex'} gap={'0.5rem'}>
        {/* <BasicPopover content={filterPopoverContent}>
            <Button 
                size="md"
                display={'flex'}
                gap={'0.5rem'}
                alignItems={'center'}
                border={'1px solid rgba(107, 114, 128, 0.6)'}
                title="Show/hide table filters"
            >
                <FontAwesomeIcon className="text-gray-500" icon={faFilter}/>
            </Button>
        </BasicPopover> */}

        <Menu>
            <MenuButton minW={150} as={Button} border={'1px solid rgba(107, 114, 128, 0.6)'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={'0.5rem'}>
                    {searchIn[0].toUpperCase() + searchIn.slice(1)}
                    <FontAwesomeIcon icon={faChevronDown}/>
                </Box>
            </MenuButton>

            <MenuList shadow={'1px 0px 5px 2px lightgray'} borderRadius={'0.5rem'} border={'1px solid lightgray'} >
                
                <MenuItem key={'All'} value={'All'} onClick={onSearchInClick}>All</MenuItem>
                
                {labels.map((column) => {
                    return <MenuItem key={column} value={column} onClick={onSearchInClick}>{column[0].toUpperCase() + column.slice(1)}</MenuItem>
                })}
                
            </MenuList>

        </Menu>

        <BasicInput placeholder="Start typing to search..." value={searchFor} onChange={onSearchForChange} onClear={handleClearClick} />

        <Button 
            size="md" 
            border={'1px solid rgba(107, 114, 128, 0.6)'}
            title="Reset table and refresh data"
            onClick={onRefreshClick}
        >
            <FontAwesomeIcon className="text-gray-500" icon={faRefresh}/>
        </Button>

    </Box>);
}
