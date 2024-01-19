import React from "react";

import BasicTab from "../../components/BasicTab/BasicTab";
import TagsTab from "./TagsTab";
import SymbolsTab from "./SymbolsTab";


export default function RegistryPage({
    selectedTab
}) {

    return (<div className="flex flex-grow">
        <BasicTab labels={['Tags', 'Units']} initialTab={selectedTab}>
            <TagsTab />
            <SymbolsTab />
        </BasicTab>
    </div>);
}