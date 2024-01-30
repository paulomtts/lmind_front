import React, { useEffect, useState } from "react";
import { faHome, faIndustry, faRightFromBracket, faFolderClosed } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@chakra-ui/react'

import { useAuth } from "./providers/AuthProvider";
import Sidebar, {SidebarItem, SidebarSubItem, SidebarContainer} from "./components/Sidebar/Sidebar";
import ProductionPage from "./pages/Production/ProductionPage";
import RegistryPage from "./pages/Registry/RegistryPage";


function App() {

    const auth = useAuth();

    const [content, setContent] = useState("Home");
    const [currentItem, setCurrentItem] = useState("Home");

    useEffect(() => {
        if (auth.isAuthenticated) {
            auth.getUserInfo()
        }
    }, [auth.isAuthenticated])

    const handleSidebarItemClick = (title) => {
        setContent(title);
        setCurrentItem(title);
    }

    return (<div className="flex">
        <Sidebar className="flex justify-between">
            <SidebarContainer className="flex flex-col gap-4">
                <SidebarItem icon={faHome} title="Home" onClick={() => handleSidebarItemClick("Home")} />

                <SidebarItem icon={faIndustry} title="Production">
                    <SidebarSubItem title="Overview" onClick={() => handleSidebarItemClick("Overview")} />
                    <SidebarSubItem title="Tasks" onClick={() => handleSidebarItemClick("Tasks")} />
                    <SidebarSubItem title="Resources" onClick={() => handleSidebarItemClick("Resources")} />
                    <SidebarSubItem title="Routes" onClick={() => handleSidebarItemClick("Routes")} />
                    <SidebarSubItem title="Products" onClick={() => handleSidebarItemClick("Products")} />
                    <SidebarSubItem title="Orders" onClick={() => handleSidebarItemClick("Orders")} />
                </SidebarItem>

                <SidebarItem icon={faFolderClosed} title="Registry">
                    <SidebarSubItem title="Tags" onClick={() => handleSidebarItemClick("Tags")} />
                    <SidebarSubItem title="Units" onClick={() => handleSidebarItemClick("Units")} />
                </SidebarItem>
            </SidebarContainer>
        
            <SidebarContainer className="flex flex-col gap-4 mb-2">
                <Avatar size={'md'} name={auth.user?.name} src={auth.user?.picture} title={auth.user?.name} />
                <SidebarItem icon={faRightFromBracket} title="Logout" text="Are you sure?">
                    <SidebarSubItem title="Confirm" onClick={() => auth.logout()} />
                    <SidebarSubItem title="Cancel" />
                </SidebarItem>
            </SidebarContainer>
        </Sidebar>

        <div className=" overflow-x-hidden w-full">
            {(() => {
                switch (content) {
                    case "Overview": return <ProductionPage selectedTab="Overview" />;
                    case "Tasks": return <ProductionPage selectedTab="Tasks" />;
                    case "Resources": return <ProductionPage selectedTab="Resources" />;
                    case "Routes": return <ProductionPage selectedTab="Routes" />;
                    case "Products": return <ProductionPage selectedTab="Products" />;
                    case "Orders": return <ProductionPage selectedTab="Orders" />;
                    
                    case "Units": return <RegistryPage selectedTab="Units" />;
                    case "Tags": return <RegistryPage selectedTab="Tags" />;
                    default: return <></>;
                }
            })()}
        </div>
    </div>);
}

export default App;