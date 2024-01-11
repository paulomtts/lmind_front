import React, { useRef, useState, useEffect } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

import "./Sidebar.css";

function Sidebar(props) {
    const selfRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (selfRef.current) {
            const rect = selfRef.current.getBoundingClientRect();

            setDimensions({ width: rect.width, height: rect.height });
        }
    }, []);

    return (
        <div className={`Sidebar Sidebar-shadow ${props.className}`} ref={selfRef}>
            {React.Children.map(props.children, (child) => {
                return React.cloneElement(child, { parentDimensions: dimensions });
            })}
        </div>
    );
}

export { SidebarContainer, SidebarItem, SidebarSubItem };
export default Sidebar;