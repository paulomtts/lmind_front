import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import SidebarSubItem from './SidebarSubItem';


export default function SidebarItem ({ 
    title
    , text
    , icon
    , offsetY = 75
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
                select-none
                text-sm
        '>

            
            <div className={`text-xl SidebarItem`} onClick={handleSidebarItemClick} ref={selfRef}>
                <FontAwesomeIcon icon={icon} title={title} />             
            </div>
            {title}

            {children &&
                <div className={`
                    ease-in-out cursor-default
                    ${isOpen ? `opacity-100 h-auto` : "opacity-0 h-0 pointer-events-none"}
                `}>
                    <div 
                        className="SidebarCard" 
                        style={{ 
                            top: Math.min(position.y, window.innerHeight - dimensions.height - offsetY)
                            , left: parentDimensions.width + 5
                        }}
                    >
                        {text && <p className='p-2'>{text}</p>}
                        <div className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                            {React.Children.map(children, (child) => {
                                if (child.type !== SidebarSubItem) {
                                    throw new Error('SidebarItem children must be of type SidebarSubItem');
                                }
                                
                                return child;
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}