import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";


export default function BasicTab({
    labels = [],
    initialTab,
    children
    , onTabClick = () => { }
}: {
    labels: string[],
    initialTab: string,
    children: React.ReactNode
    onTabClick?: (index: number) => void
}) {

    if (labels.length !== React.Children.count(children)) {
        throw new Error('Labels length must match children length');
    }

    const [index, setIndex] = useState(labels.indexOf(initialTab));
    
    useEffect(() => {
        const newIndex = labels.indexOf(initialTab);
        setIndex(newIndex);
    }, [initialTab]);



    const handleTabClick = (index: number) => {
        setIndex(index);
        onTabClick(index);
    }

    return (<div style={{width: '100%'}}>
        <Tabs index={index} onChange={handleTabClick}>

            <TabList className="bg-slate-200 shadow-sm">
                {labels.map((label) => (
                    <Tab key={label}>{label[0].toUpperCase() + label.slice(1)}</Tab>
                ))}
            </TabList>

            <TabPanels>
                {React.Children.map(children, (child, index) => {
                    return (
                        <TabPanel key={index}>
                            {child}
                        </TabPanel>
                    )
                })}
            </TabPanels>
        </Tabs>
    </div>);
}