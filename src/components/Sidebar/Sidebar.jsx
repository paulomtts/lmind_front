import React, { useRef, useState, useEffect } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

import "./Sidebar.css";

function Sidebar({
    currentItem = "",
    children,
}) {
    const selfRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


    /* Effects */
    useEffect(() => {
        if (selfRef.current) {
            const rect = selfRef.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        }
    }, []);


    return (
        <div style={selfRef.current && {width: dimensions.width}}>

            <div className='Sidebar' ref={selfRef} style={{boxShadow: '1px 0 8px 0px rgba(0,0,0,0.3)', zIndex: '1000'}}>
                {React.Children.map(children, (child) => {
                    if (child.type !== SidebarContainer && child.type !== SidebarItem) {
                        throw new Error("Sidebar only accepts SidebarContainer and SidebarItem components as children");
                    }

                    return React.cloneElement(child, { parentDimensions: dimensions, currentItem: currentItem });
                })}
            </div>
        </div>

    );
}

export { SidebarContainer, SidebarItem, SidebarSubItem };
export default Sidebar;