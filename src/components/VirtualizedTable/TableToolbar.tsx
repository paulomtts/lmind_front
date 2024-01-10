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

import BasicPopover from "../BasicPopover/BasicPopover";
import FilterBox from "./FilterBox";


export default function TableToolbar({
    columns,
    filters,
    searchIn,
    searchFor,
    onSearchInClick,
    onSearchForChange,
    onRefreshClick,
    onChangeFilters,
}) {

    const filterPopoverContent = <FilterBox filters={filters} onChangeFilters={onChangeFilters}/>;

    return (<Box display={'flex'} gap={'0.5rem'}>
        <BasicPopover content={filterPopoverContent}>
            <Button size="md" display={'flex'} gap={'0.5rem'} alignItems={'center'} border={'1px solid rgba(107, 114, 128, 0.6)'}>
                <FontAwesomeIcon className="text-gray-500" icon={faFilter}/>
            </Button>
        </BasicPopover>

        <Menu>
            <MenuButton minW={150} as={Button} border={'1px solid rgba(107, 114, 128, 0.6)'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={'0.5rem'}>
                    {searchIn}
                    <FontAwesomeIcon icon={faChevronDown}/>
                </Box>
            </MenuButton>
            <MenuList shadow={'1px 0px 5px 2px lightgray'} borderRadius={'0.5rem'} border={'1px solid lightgray'} >
                <MenuItem key={'All'} value={'All'} onClick={onSearchInClick}>All</MenuItem>
                {columns.map((column) => {
                    return <MenuItem key={column} value={column} onClick={onSearchInClick}>{column}</MenuItem>
                })}
            </MenuList>
        </Menu>

        <Input type="text" placeholder="Start typing to search..." value={searchFor} onChange={onSearchForChange} border={'1px solid rgba(107, 114, 128, 0.6)'}/>

        <Button size="md" onClick={onRefreshClick} padding={'0 1.25rem'} display={'flex'} gap={'0.5rem'} alignItems={'center'} border={'1px solid rgba(107, 114, 128, 0.6)'}>
            <FontAwesomeIcon className="text-gray-500" icon={faRefresh}/>
            Refresh
        </Button>

    </Box>);
}
