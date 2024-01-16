import React from "react";

import BasicTab, { TabModel } from "../../components/BasicTab/BasicTab";
import SymbolsTab from "./SymbolsTab";


export default function RegistryPage({
    selectedTab
}) {

    const symbolsTab: TabModel = {
        name: 'Symbols',
        content: <SymbolsTab />
    }

    const tagsTab: TabModel = {
        name: 'Tags',
        content: <>test</>
    }

    const initialTab = [symbolsTab, tagsTab].find(tab => tab.name === selectedTab) || symbolsTab;

    return (<>
        <BasicTab tabs={[symbolsTab, tagsTab]} initialTab={initialTab} />
    </>);
}