import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";

import Tasks from "./TasksTab";


export default function ProductionPage({
    selectedTab = 'tasks',
}) {

    const tabs = ['Overview', 'Tasks', 'Resources', 'Routes', 'Products', 'Orders'];
    const [index, setIndex] = useState(tabs.indexOf(selectedTab));
    
    useEffect(() => {
        setIndex(tabs.indexOf(selectedTab));
    }, [selectedTab]);
    
    const handleTabClick = (index: number) => {
        setIndex(index);
    }

    return (<div style={{width: '100%'}}>
        <Tabs index={index} onChange={handleTabClick}>
            <TabList>
                {tabs.map((tab) => (
                    <Tab key={tab}>{tab[0].toUpperCase() + tab.slice(1)}</Tab>
                ))}
     
            </TabList>

            <TabPanels>
                <TabPanel>
                    <p>Notifications</p>
                    <p>Task status table</p>
                    <p>Orders gantt chart</p>
                </TabPanel>

                <TabPanel>
                    <Tasks />
                </TabPanel>

                <TabPanel>
                    Create resource button
                    Table of resources
                    Resources gantt chart
                </TabPanel>

                <TabPanel>
                    Routes table
                    Route builder flow
                </TabPanel>

                <TabPanel>
                    Products table
                    Product builder flow
                </TabPanel>

                <TabPanel>
                    Orders table
                    Order builder flow
                </TabPanel>

            </TabPanels>
        </Tabs>
    </div>);
}
