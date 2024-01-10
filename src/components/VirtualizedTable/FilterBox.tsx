import React from "react";

import { Filter } from "./models";

export default function FilterBox({
    filters,
    onChangeFilters,
}: {
    filters: Filter[],
    onChangeFilters: (filters: Filter[]) => void,
}) {
    return (<>
        Filterbox
    </>);
}