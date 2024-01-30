import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import TasksTab from "./TasksTab";


export default function RegistryPage({
    selectedTab
}) {

    return (
    <BasicTabs labels={['Tasks']} initialTab={selectedTab}>
        <TasksTab />
    </BasicTabs>
    );
}