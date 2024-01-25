import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import TagsTab from "./TagsTab";
import UnitsTab from "./UnitsTab";


export default function RegistryPage({
    selectedTab
}) {

    return (<div className="flex flex-grow">
        <BasicTabs labels={['Tags', 'Units']} initialTab={selectedTab}>
            <TagsTab />
            <UnitsTab />
        </BasicTabs>
    </div>);
}