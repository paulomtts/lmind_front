import React, { useEffect, useState } from "react";
import { faHome, faIndustry, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@chakra-ui/react'

import Sidebar, {SidebarItem, SidebarSubItem, SidebarContainer} from "./components/Sidebar/Sidebar";
import ProductionPage from "./pages/Production/ProductionPage";
import { useAuth } from "./providers/AuthProvider";


function App() {

    const auth = useAuth();

    const [content, setContent] = useState("home");

    useEffect(() => {
        if (auth.isAuthenticated) {
            auth.getUserInfo()
        }
    }, [auth.isAuthenticated])

    const handleSidebarItemClick = (title) => {
        setContent(title);
    }

    return (<div className="flex">
        <Sidebar className="flex justify-between">
            <SidebarContainer className="flex flex-col gap-4">
                <SidebarItem icon={faHome} title="Home" onClick={() => handleSidebarItemClick("home")} />

                <SidebarItem icon={faIndustry} title="Production">
                    <SidebarSubItem title="Overview" onClick={() => handleSidebarItemClick("overview")} />
                    <SidebarSubItem title="Tasks" onClick={() => handleSidebarItemClick("tasks")} />
                    <SidebarSubItem title="Resources" onClick={() => handleSidebarItemClick("resources")} />
                    <SidebarSubItem title="Routes" onClick={() => handleSidebarItemClick("routes")} />
                    <SidebarSubItem title="Products" onClick={() => handleSidebarItemClick("products")} />
                    <SidebarSubItem title="Orders" onClick={() => handleSidebarItemClick("orders")} />
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

        {content === "home" ? 
            <ProductionPage selectedTab="tasks" />
        : null}

        {['overview', 'tasks', 'resources', 'routes', 'products', 'orders'].includes(content) ?
            <ProductionPage selectedTab={content} />
        : null}
    </div>);
}

export default App;