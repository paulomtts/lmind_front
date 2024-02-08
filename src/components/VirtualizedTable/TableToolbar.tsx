import React from "react";
import {
    Menu
    , MenuButton
    , MenuList
    , MenuItem
    , Button
    , Box
    , Switch
    , FormControl
    , FormLabel
    , IconButton
} from "@chakra-ui/react";

import { faChevronDown, faRefresh, faFilter, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ClearableInput from "../ClearableInput/ClearableInput";
import BasicPopover from "../BasicPopover/BasicPopover";
import FilterBox from "./FilterBox";
import { Filter } from "./models";
import { DataRow } from "../../providers/data/models";


export default function TableToolbar({
    labels
    , filters
    , searchIn
    , searchFor
    , selectable
    , selectedData
    , onSearchInClick = () => {}
    , onSearchForChange = () => {}  
    , onSwitchChange = () => {}
    , onRefreshClick = () => {} 
    , onChangeFilters = () => {}
}: {
    labels: string[];
    filters: Filter[];
    searchIn: string;
    searchFor: string;
    selectable?: boolean;
    selectedData?: DataRow[];
    onSearchInClick: (event: React.MouseEvent<HTMLElement>) => void;
    onSearchForChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRefreshClick: (event: React.MouseEvent<HTMLElement>) => void;
    onChangeFilters: (filters: Filter[]) => void;
}) {

    const [switchChecked, setSwitchChecked] = React.useState<boolean>();
    // const filterPopoverContent = <FilterBox filters={filters} onChangeFilters={onChangeFilters}/>;


    /* Effects */
    React.useEffect(() => {
        if (selectedData) {
            setSwitchChecked(Boolean(selectedData.length > 0));
        }
    }, []);


    /* Handlers */
    const handleClearClick = () => {
        onSearchForChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchChecked(event.target.checked);
        onSwitchChange(event);
    }

    return (<Box className="flex items-center gap-2 mb-2">
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
                
                {labels.map((column, index) => {
                    return <MenuItem key={`${column}-${index}`} value={column} onClick={onSearchInClick}>{column}</MenuItem>
                })}
                
            </MenuList>

        </Menu>

        <ClearableInput 
            placeholder="Start typing to search..." 
            value={searchFor} 
            disabled={switchChecked}
            onChange={onSearchForChange} 
            onClear={handleClearClick} 
        />

        {selectable && 
        <FormControl className="flex items-center gap-2 max-w-fit ml-1 mr-1">
            <Switch 
                size="md"
                colorScheme="blue"
                title="Click to toggle between showing all rows and only the selected ones"
                isChecked={switchChecked}
                isDisabled={Boolean(searchFor)}
                onChange={(e) => handleSwitchChange(e)}
            />
            <FormLabel className="mt-1 font-light">Filter selected</FormLabel>
        </FormControl>
        }

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
