import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import TagsTab from "./TagsTab";
import SymbolsTab from "./SymbolsTab";


export default function RegistryPage({
    selectedTab
}) {

    return (<div className="flex flex-grow">
        <BasicTabs labels={['Tags', 'Units']} initialTab={selectedTab}>
            <TagsTab />
            <SymbolsTab />
        </BasicTabs>
    </div>);
}