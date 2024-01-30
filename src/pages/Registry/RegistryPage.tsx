import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import TagsTab from "./TagsTab";
import UnitsTab from "./UnitsTab";


export default function RegistryPage({
    selectedTab
}) {

    return (
    <BasicTabs labels={['Tags', 'Units']} initialTab={selectedTab}>
        <TagsTab />
        <UnitsTab />
    </BasicTabs>
    );
}