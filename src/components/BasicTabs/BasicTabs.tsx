import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";


export default function BasicTabs({
    labels = []
    , initialTab
    , padding = '1rem'
    , children
    , onTabClick = () => { }
}: {
    labels: string[];
    initialTab: string;
    padding?: string;
    children: React.ReactNode;
    onTabClick?: (index: number) => void;
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

    return (
    <div style={{width: '100%'}}>
        <Tabs index={index} onChange={handleTabClick}>

            <TabList className="bg-slate-200 shadow-sm fixed w-screen z-50" style={{boxShadow: '0px 2px 8px 0 rgba(0,0,0,0.3)', borderBottom: '1px solid lightgray'}}>
                {labels.map((label) => (
                    <Tab key={label}>{label[0].toUpperCase() + label.slice(1)}</Tab>
                ))}
            </TabList>

            <TabPanels height={'100vh'}>
                {React.Children.map(children, (child, index) => {
                    return (
                        <TabPanel key={index} padding={padding}>
                            <div className="mt-10">
                                {child}
                            </div>
                        </TabPanel>
                    )
                })}
            </TabPanels>
        </Tabs>
    </div>
    );
}