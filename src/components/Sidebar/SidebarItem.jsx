import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function SidebarItem ({ 
    title
    , text
    , icon
    , offsetY = 45
    , currentItem
    , parentDimensions
    , children
    , onClick 
}) {
    const selfRef = useRef(null);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isOpen, setIsOpen] = useState(false);
  
    useEffect(() => {
        if (selfRef.current) {
            const rect = selfRef.current.getBoundingClientRect();

            setPosition({ x: rect.left, y: rect.top });
            setDimensions({ width: rect.width, height: rect.height });           
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
        if (onClick) onClick();
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
                ${currentItem === title ? "text-red-500" : ""}
            `}>
                <FontAwesomeIcon icon={icon} title={title} />               

                {children &&
                <div className={`transition-all duration-300 ease-in-out
                    ${isOpen ? `opacity-100 h-auto` : "opacity-0 h-0 pointer-events-none"}
                `}>
                    <div className="SidebarCard" style={{ 
                        top: Math.min(position.y, window.innerHeight - dimensions.height - offsetY)
                        , left: parentDimensions.width + 5
                    }}>
                        {text && <p className='p-2'>{text}</p>}
                        {children}
                    </div>
                </div>}
            </div>

            {title}
        </div>
    );
}