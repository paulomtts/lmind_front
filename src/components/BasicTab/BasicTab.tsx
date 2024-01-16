import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";

import { TabModel } from './models';


export default function BasicTab({
    tabs = [],
    initialTab,
}: {
    tabs: TabModel[],
    initialTab: TabModel
}) {

    const [index, setIndex] = useState(tabs.indexOf(initialTab));
    
    useEffect(() => {
        const newIndex = tabs.indexOf(initialTab);
        setIndex(newIndex);
    }, [initialTab]);
    
    const handleTabClick = (index: number) => {
        setIndex(index);
    }

    return (<div style={{width: '100%'}}>
        <Tabs index={index} onChange={handleTabClick}>

            <TabList>
                {tabs.map((tab) => (
                    <Tab key={tab.name}>{tab.name[0].toUpperCase() + tab.name.slice(1)}</Tab>
                ))}
            </TabList>

            <TabPanels>
                {tabs.map((tab) => (
                    <TabPanel key={tab.name}>
                        {tab.content}
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    </div>);
}

export { TabModel }