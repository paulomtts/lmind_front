import React, { useRef, useState, useEffect } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

import "./Sidebar.css";

function Sidebar({
    className = "",
    currentItem = "",
    children,
}) {
    const selfRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (selfRef.current) {
            const rect = selfRef.current.getBoundingClientRect();

            setDimensions({ width: rect.width, height: rect.height });
        }
    }, []);

    return (
        <div className="w-20">
            <div className={`Sidebar Sidebar-shadow ${className}`} ref={selfRef}>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, { parentDimensions: dimensions, currentItem: currentItem });
                })}
            </div>
        </div>
    );
}

export { SidebarContainer, SidebarItem, SidebarSubItem };
export default Sidebar;