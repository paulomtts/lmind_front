import React, { useState, useRef, useEffect } from "react";
import { Box, Table } from "@chakra-ui/react";

import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Sorter, Filter } from "./models";
import { DataObject, DataRow } from "../../providers/data/dataModels";


export default function VirtualizedTable ({
    data, 
    onClickRow = () => {},
    onRefreshClick = () => {}
}: { 
    data: DataObject
    , onClickRow?: (row: DataRow) => void
    , onRefreshClick?: () => void
}) {
    
    const [compData, setCompData] = useState<DataObject>(data);
    const [searchIn, setSearchIn] = useState<string>("All");
    const [searchFor, setSearchFor] = useState<string>("");
    const [sorters, setSorters] = useState<Sorter[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);

    const containerRef = useRef<HTMLDivElement>(null!);


    /* Effects */
    useEffect(() => {
        if (Object.keys(data.json()).length === 0) return;

        const newSorters = data.rows[0].getVisibleFields().map((field) => {
            return new Sorter(field.name, field.label, 'none');
        });

        setCompData(data);
        setSorters(newSorters);

    }, [data]);


    /* Functions */
    function filterRows(searchFor: string) {
        const visibleColumns = data.getVisibleColumns();

        let newData: DataObject;

        if (searchIn === "All") {
            const newJson = data.json().filter((row) => {
                return visibleColumns.some((column) => {
                    return row[column].toString().includes(searchFor);
                });
            });

            newData = new DataObject(data.tableName, newJson);

        } else {
            const newJson = data.json().filter((row) => {
                return row[searchIn].toString().includes(searchFor);
            });

            newData = new DataObject(data.tableName, newJson);
        }

        return newData;
    }

    function multiSort(sorters: Sorter[]) {
        const columns = data.getVisibleColumns();
        
        return data.json().sort((a, b) => {
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
    };

    const handleSearchForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!compData) return;

        const newSearchFor = e.target.value;

        const newData = filterRows(newSearchFor);
        
        setCompData(newData);
        setSearchFor(newSearchFor);
    };

    const handleSortClick = (targetSorter: Sorter) => {
        if (!compData) return;

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
        
        setCompData(newData);
    };

    const handleRefreshClick = () => {
        setSearchIn("All");
        setSearchFor("");
        setSorters(
            data.rows[0].fields.map((field) => {
                return new Sorter(field.name, field.label, 'none');
            })
        );
        setCompData(data);

        onRefreshClick();
    }

    return (<>
        <TableToolbar
            columns={compData.getVisibleColumns()}
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
                <TableBody data={compData} containerRef={containerRef} sorters={sorters} onClickRow={onClickRow} />
            </Table>
        </Box>
    </>);
}