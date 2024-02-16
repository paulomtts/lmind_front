import React from "react";
import { DataRow } from "../providers/data/models";

export const useTag = () => {

    const emptyState = new DataRow('tsys_tags');    // CHANGE THIS LATER, OR IT WILL NOT WORK
    const [tag, setTag] = React.useState<DataRow>(emptyState);

    const handleTagFormOnChange = (newTag: DataRow) => {
        setTag(newTag);
    }

    return {
        tag
        , handleTagFormOnChange
    };
}