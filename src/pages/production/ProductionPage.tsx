import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import RecordsTab from "./RecordsTab/RecordsTab";
import RoutesTab from "./RoutesTab/RoutesTab";

export default function RegistryPage({
    selectedTab
}) {

    return (
    <BasicTabs labels={['Records', 'Routes']} initialTab={selectedTab}>
        <RecordsTab />
        <RoutesTab />
    </BasicTabs>
    );
}