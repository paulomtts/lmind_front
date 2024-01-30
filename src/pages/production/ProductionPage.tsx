import React from "react";

import BasicTabs from "../../components/BasicTabs/BasicTabs";
import TasksTab from "./TasksTab";


export default function RegistryPage({
    selectedTab
}) {

    return (<div className="flex flex-grow z-0">
        <BasicTabs labels={['Tasks']} initialTab={selectedTab}>
            <TasksTab />
        </BasicTabs>
    </div>);
}