import React from 'react';

import SidebarItem from './SidebarItem';

export default function SidebarContainer(props) {
    return (
        <div className={props.className} style={{ height: props.height }}>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child) && child.type === SidebarItem) {
                    return React.cloneElement(child, { parentDimensions: props.parentDimensions });
                }
                return child;
            })}
        </div>
    );
}