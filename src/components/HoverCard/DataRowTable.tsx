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
    , columns
}: {
    row: DataRow;
    columns: string[] | undefined;
}) {

    return (<Table variant="simple" size="sm" className="">
            <Tbody>
                {row.fields.map((field, index) => {
                    if (!field.visible.read) return null;
                    if (columns && !columns.includes(field.name)) return null;

                    return (<Tr key={`field-${index}`}>
                        <Th>{field.label}</Th>
                        <Td>{String(field.value)}</Td>
                    </Tr>);
                })}
            </Tbody>
        </Table>
    );
}