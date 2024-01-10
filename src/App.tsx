import React, { useState } from "react";
import { faHome, faIndustry } from '@fortawesome/free-solid-svg-icons';

import Sidebar from "./components/Sidebar/Sidebar";
import SidebarItem from "./components/Sidebar/SidebarItem";
import SidebarSubItem from "./components/Sidebar/SidebarSubItem";
import Production from "./pages/production/Production";



function App() {
    const [content, setContent] = useState("home");

    const handleSidebarItemClick = (title: string) => {
        setContent(title);
    }

    return (<div className="flex">
        <Sidebar>
            <SidebarItem icon={faHome} title="Home" onClick={() => handleSidebarItemClick("home")} />
            <SidebarItem icon={faIndustry} title="Production">
                <SidebarSubItem title="Overview" onClick={() => handleSidebarItemClick("overview")} />
                <SidebarSubItem title="Tasks" onClick={() => handleSidebarItemClick("tasks")} />
                <SidebarSubItem title="Resources" onClick={() => handleSidebarItemClick("resources")} />
                <SidebarSubItem title="Routes" onClick={() => handleSidebarItemClick("routes")} />
                <SidebarSubItem title="Products" onClick={() => handleSidebarItemClick("products")} />
                <SidebarSubItem title="Orders" onClick={() => handleSidebarItemClick("orders")} />
            </SidebarItem>
        </Sidebar>

        {content === "home" ? 
            <Production selectedTab="tasks" />
        : null}

        {['overview', 'tasks', 'resources', 'routes', 'products', 'orders'].includes(content) ?
            <Production selectedTab={content} />
        : null}
    </div>);
}

export default App;