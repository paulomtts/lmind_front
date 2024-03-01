import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import RecordsTab from "./RecordsTab/RecordsTab";
import RoutesTab from "./RoutesTab/RoutesTab";
import { FlowProvider } from "../../providers/FlowProvider";

export default function RegistryPage({
    selectedTab
}) {

    return (
    <BasicTabs labels={['Records', 'Routes']} initialTab={selectedTab}>
        <RecordsTab />

        <FlowProvider>
            <RoutesTab />
        </FlowProvider>
    </BasicTabs>
    );
}