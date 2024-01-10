import React, { useState, useRef } from "react";
import { Box, Table } from "@chakra-ui/react";

import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Sorter, Filter } from "./models";
import { FormField } from "../BasicForm/models";


export default function VirtualizedTable ({
    columns,
    initialData, 
    onClickRow = () => {},
}: { 
    columns: string[];
    initialData: Record<string, any>[];
    onClickRow?: (row: FormField[]) => void; 
}) {
    
    const [data, setData] = useState<Record<string, any>[]>([...initialData]);
    const [searchIn, setSearchIn] = useState<string>("All");
    const [searchFor, setSearchFor] = useState<string>("");
    const [sorters, setSorters] = useState<Sorter[]>(
        columns.map((column) => {
            return new Sorter(column, 'none');
        })
    );
    const [filters, setFilters] = useState<Filter[]>([]);

    const containerRef = useRef<HTMLDivElement>(null!);

    /* Functions */
    function multiColumnSort(data: Record<string, any>[], columns: string[], targetColumn: string, sorters: Sorter[]) {
        return data.sort((a, b) => {
            for (let i = 0; i < columns.length; i++) {

                const sortCondition = sorters.find((sortObject) => {
                    return sortObject.label === columns[i];
                });

                if (!sortCondition) continue;

                const prop = columns[i];
                const direction = sortCondition.direction;
                if(direction === 'none') {
                    if(columns[i] === targetColumn) {
                        return initialData.indexOf(a) - initialData.indexOf(b);
                    }
                    continue;
                }
                
                if(direction === 'asc') {
                    if (a[prop] !== b[prop]) {
                        return a[prop] > b[prop] ? 1 : -1;
                    }
                } else if(direction === 'desc') {
                    if (a[prop] !== b[prop]) {
                        return a[prop] < b[prop] ? 1 : -1;
                    }
                }
            }
            return 0;
        });
    }

    
    /* Handlers */
    const handleSearchInClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchIn(e.target.value);
    };

    const handleSearchForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchFor = e.target.value;

        if (searchIn === "All") {
            const newData = initialData.filter((row) => {
                return Object.keys(row).some((key) => {
                    return row[key].toString().includes(newSearchFor);
                });
            });

            setData(newData);
        } else {
            const newData = initialData.filter((row) => {
                return row[searchIn].toString().includes(newSearchFor);
            });

            setData(newData);
        }

        setSearchFor(newSearchFor);
    };

    const handleSortClick = (label: string) => {
        const newSort = sorters.map((sortObject) => {
            if (sortObject.label === label) {
                if (sortObject.direction === 'none') {
                    sortObject.direction = 'asc';
                } else if (sortObject.direction === 'asc') {
                    sortObject.direction = 'desc';
                } else if (sortObject.direction === 'desc') {
                    sortObject.direction = 'none';
                }
            }
            return sortObject;
        });

        setSorters(newSort);

        const newData = multiColumnSort(data, columns, label, newSort);
        setData(newData);
    };

    const handleRefreshClick = () => {
        setSearchIn("all");
        setSearchFor("");
        setSorters(
            columns.map((column) => {
                return {
                    label: column,
                    direction: "none",
                };
            })
        );
        setData([...initialData]);
    }

    return (<>
        <TableToolbar
            columns={columns}
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