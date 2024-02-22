import React from "react";
import {
    Table,
    Tr,
    Th,
    Tbody,
    Td,
} from '@chakra-ui/react'

import { DataRow } from "../../providers/data/models";


export default function DataRowTable({
    row
}: {
    row: DataRow
}) {

    const objectType = row.getField('type').value;
    const [columns, setColumns] = React.useState<string[]>([]);

    React.useEffect(() => {
        let newColumns: string[] = [];

        switch (objectType) {
            case 'product-category':
                newColumns = ['code_a', 'counter_a', 'created_by'];
                break;
            default:
                newColumns = [];
        }

        setColumns(newColumns);
    }, [row]);


    return (<Table variant="simple" size="sm" className="">
            <Tbody>
                {row.fields.map((field, index) => {
                    if (!field.visible.read) return null;
                    if (String(objectType).includes('-category') && !columns.includes(field.name)) return null;

                    return (<Tr key={`field-${index}`}>
                        <Th>{field.label}</Th>
                        <Td>{String(field.value)}</Td>
                    </Tr>);
                })}
            </Tbody>
        </Table>
    );
}