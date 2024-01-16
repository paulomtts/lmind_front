import React, { useState, useRef, useEffect } from "react";
import { Box, Table } from "@chakra-ui/react";

import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Sorter, Filter } from "./models";
import { DataObject, DataRow } from "../../providers/data/dataModels";


export default function VirtualizedTable ({
    initialData, 
    onClickRow = () => {},
    onRefreshClick = () => {}
}: { 
    columns: string[]
    , initialData: DataObject
    , onClickRow?: (row: DataRow) => void
    , onRefreshClick?: () => void
}) {
    
    const [data, setData] = useState<DataObject>(initialData);
    const [searchIn, setSearchIn] = useState<string>("All");
    const [searchFor, setSearchFor] = useState<string>("");
    const [sorters, setSorters] = useState<Sorter[]>(
        initialData.getVisibleColumns().map((column) => {
            return new Sorter(column, 'none');
        })
    );
    const [filters, setFilters] = useState<Filter[]>([]);

    const containerRef = useRef<HTMLDivElement>(null!);


    /* Effects */
    useEffect(() => {
        setData(initialData);
    }, [initialData]);


    /* Functions */
    function filterRows(data: DataObject, searchFor: string) {
        const visibleColumns = data.getVisibleColumns();

        let newData: DataObject;

        if (searchIn === "All") {
            const newJson = initialData.json.filter((row) => {
                return visibleColumns.some((column) => {
                    return row[column].toString().includes(searchFor);
                });
            });

            newData = new DataObject(initialData.tableName, newJson);

        } else {
            const newJson = initialData.json.filter((row) => {
                return row[searchIn].toString().includes(searchFor);
            });

            newData = new DataObject(initialData.tableName, newJson);
        }

        return newData;
    }

    function multiSort(data: DataObject, sorters: Sorter[]) {
        const columns = initialData.getVisibleColumns();
        const filteredRows = filterRows(data, searchFor);
        
        return filteredRows.json.sort((a, b) => {
            return columns.reduce((result, col) => {
                if (result !== 0) return result;
        
                const currSort = sorters.find((sortObject) => {
                    return sortObject.label === col;
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
    };

    const handleSearchForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!data) return;

        const newSearchFor = e.target.value;

        const newData = filterRows(data, newSearchFor);
        
        setData(newData);
        setSearchFor(newSearchFor);
    };

    const handleSortClick = (targetSorter: Sorter) => {
        if (!data) return;

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

        const newJson = multiSort(data, newSorters);
        const newData = new DataObject(initialData.tableName, newJson);
        
        setData(newData);
    };

    const handleRefreshClick = () => {
        setSearchIn("All");
        setSearchFor("");
        setSorters(initialData.getVisibleColumns().map((column) => {
                return {
                    label: column,
                    direction: "none",
                };
        }));
        setData(initialData);

        onRefreshClick();
    }

    return (<>
        <TableToolbar
            columns={data.getVisibleColumns()}
            filters={filters}
            searchIn={searchIn}
            searchFor={searchFor}
            onSearchInClick={handleSearchInClick}
            onSearchForChange={handleSearchForChange}
            onRefreshClick={handleRefreshClick}
            onChangeFilters={() => {}}
        />

        <Box height={'calc(100vh - 188px)'} overflowY={'auto'} ref={containerRef}>
            <Table size='sm' variant={'unstyled'}>
                <TableHeader sorters={sorters} onSortClick={handleSortClick} />
                <TableBody data={data} containerRef={containerRef} sorters={sorters} onClickRow={onClickRow} />
            </Table>
        </Box>
    </>);
}