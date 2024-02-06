import React, { useState, useRef, useEffect } from "react";
import { Box, Table, TableContainer } from "@chakra-ui/react";

import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Sorter, Filter } from "./models";
import { DataObject, DataRow } from "../../providers/data/models";


export default function VirtualizedTable ({
    data
    , selectedData = []
    , editable = true
    , selectable = false
    , fillScreen = true
    , onEditClick = () => {}
    , onSelectClick = () => {}
    , onRefreshClick = () => {}
}: { 
    data: DataObject
    , selectedData?: DataRow[]
    , editable?: boolean
    , selectable?: boolean
    , fillScreen?: boolean
    , onEditClick?: (row: DataRow) => void
    , onSelectClick?: (row: DataRow) => void
    , onRefreshClick?: () => void
}) {
    
    const [state, setState] = useState<DataObject>(data);
    const [searchIn, setSearchIn] = useState<string>("All");
    const [searchFor, setSearchFor] = useState<string>("");
    const [sorters, setSorters] = useState<Sorter[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);

    const containerRef = useRef<HTMLDivElement>(null!);


    /* Effects */
    useEffect(() => {
        if (Object.keys(data.json).length === 0) return;

        const newSorters = data.rows[0].getVisible('read').map((field) => {
            return new Sorter(field.name, field.label, 'none');
        });

        setState(data);
        setSorters(newSorters);
    }, [data]);


    /* Functions */
    function filterRows(searchFor: string, searchIn: string) {
        if (!searchFor) return data;
        const searchForLower = searchFor.toLowerCase();

        const newData = state.rows.filter((row) => {
            if(searchIn === "All") {
                const fields = row.getVisible();

                return fields.some((field) => {
                    const value = String(field.value).toLowerCase();
                    return value.includes(searchForLower);
                });

            } else {
                const field = row.fields.filter((field) => field.label === searchIn)[0];
                if(!field) return data;

                const value = String(field.value).toLowerCase();
                return value.includes(searchForLower);
            }
        });

        const newJson = newData.map((row) => {
            return row.json;
        });

        return new DataObject(data.tableName, newJson);

    }

    function multiSort(sorters: Sorter[]) {
        const columns = sorters.map((sorter) => {
            return sorter.name;
        });

        
        return data.json.sort((a, b) => {
            return columns.reduce((result, col) => {
                if (result !== 0) return result;
                const currSort = sorters.find((sortObject) => {
                    return sortObject.name === col;
                });
                
                if (!currSort) return 0;
                
                if(currSort.direction === 'none') {
                    return 0;
                }
                
                if(currSort.direction === 'asc') {
                    if (a[col] !== b[col]) {
                        return a[col] > b[col] ? 1 : -1;
                    }
                } else if(currSort.direction === 'desc') {
                    if (a[col] !== b[col]) {
                        return a[col] < b[col] ? 1 : -1;
                    }
                } 
                
        
                return 0;
            }, 0);
        });
    };

    
    /* Handlers */
    const handleSearchInClick = (e: any) => {
        setSearchIn(e.target.value);

        const newData = filterRows(searchFor, e.target.value);
        setState(newData);
    };

    const handleSearchForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!state) return;

        const newSearchFor = e.target.value;

        const newData = filterRows(newSearchFor, searchIn);
        
        setState(newData);
        setSearchFor(newSearchFor);
    };

    const handleSortClick = (targetSorter: Sorter) => {
        if (!state) return;

        const newSorters = sorters.map((srt) => {
            if (srt.label === targetSorter.label) {
                if (srt.direction === 'none') {
                    srt.direction = 'asc';
                } else if (srt.direction === 'asc') {
                    srt.direction = 'desc';
                } else if (srt.direction === 'desc') {
                    srt.direction = 'none';
                }
            }
            return srt;
        });

        setSorters(newSorters);

        const newJson = multiSort(newSorters);
        const newData = new DataObject(data.tableName, newJson);
        
        setState(newData);
    };

    const handleRefreshClick = () => {
        setSearchIn("All");
        setSearchFor("");
        setSorters(
            data.rows[0].fields.map((field) => {
                return new Sorter(field.name, field.label, 'none');
            })
        );
        setState(data);

        onRefreshClick();
    }

    return (<>
        <TableToolbar
            labels={sorters.map((sorter) => {
                return sorter.label;
            })}
            filters={filters}
            searchIn={searchIn}
            searchFor={searchFor}
            onSearchInClick={handleSearchInClick}
            onSearchForChange={handleSearchForChange}
            onRefreshClick={handleRefreshClick}
            onChangeFilters={() => {}}
        />

        <Box height={fillScreen ? 'calc(100vh - 188px)' : ''} overflowY={'auto'} ref={containerRef}>
            <TableContainer>
                <Table size='sm' variant={'unstyled'}>
                    <TableHeader 
                        sorters={sorters} 
                        onSortClick={handleSortClick} 
                        editable={editable} 
                        selectable={selectable}
                    />
                    <TableBody
                        data={state} 
                        selectedData={selectedData}
                        sorters={sorters} 
                        containerRef={containerRef} 
                        editable={editable} 
                        selectable={selectable}
                        onEditClick={onEditClick} 
                        onSelectClick={onSelectClick} 
                    />
                </Table>
            </TableContainer>
        </Box>
    </>);
}