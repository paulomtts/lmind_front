import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function SidebarItem(props) {   
    const selfRef = useRef(null);

    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [isOpen, setIsOpen] = useState(false);
  
    useEffect(() => {
        if (selfRef.current) {
            const rect = selfRef.current.getBoundingClientRect();

            setPosition({ x: rect.left, y: rect.top });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!selfRef.current) return;
            if (
                !selfRef.current.contains(event.target) &&
                !event.target.closest('.SidebarCard') // Exclude clicks inside SidebarCard
            ) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSidebarItemClick = () => {
        if (props.onClick) props.onClick();
        setIsOpen(!isOpen);
    }

    return (
        <div className='
                flex flex-col items-center gap-2
                select-none cursor-pointer
                text-sm'
            onClick={handleSidebarItemClick}
            ref={selfRef}
        >

            <div className={`
                text-xl
                SidebarItem
            `}>
                <FontAwesomeIcon icon={props.icon} title={props.title} />               

                {props.children &&
                <div className={`transition-all duration-300 ease-in-out
                    ${isOpen ? `opacity-100 h-auto` : "opacity-0 h-0 pointer-events-none"}
                `}>
                    <div className="SidebarCard" style={{ top: position.y, left: props.parentDimensions.width + 5}}>
                        {props.children}
                    </div>
                </div>}
            </div>

            {props.title}
        </div>
    );
}

export default SidebarItem;