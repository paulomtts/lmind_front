import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import RecordsTab from "./RecordsTab/RecordsTab";

export default function RegistryPage({
    selectedTab
}) {

    return (
    // <BasicTabs labels={['Records']} initialTab={selectedTab} padding="1.2rem 0rem 0rem 1rem">
    <BasicTabs labels={['Records']} initialTab={selectedTab}>
        <RecordsTab />
    </BasicTabs>
    );
}