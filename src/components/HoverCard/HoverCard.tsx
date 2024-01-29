import React, { useRef } from "react";

import DataRowTable from "./DataRowTable.js";
import { useMouse } from "../../providers/MouseProvider.jsx";


export default function HoverCard({
    className = "rounded-md bg-white border border-gray-300 shadow-md p-2"
    , scrollableContainerRef
    , zIndex = 1001
    , customX = 0
    , customY = 0
    , content
    , children
}: {
    className?: string
    , scrollableContainerRef: React.RefObject<HTMLDivElement>
    , zIndex?: number
    , customX?: number
    , customY?: number
    , content?: React.ReactNode
    , children: React.ReactNode
}) {

    const { position } = useMouse();
    const optionRef = useRef(null);
    const cardRef = useRef(null);

    const [show, setShow] = React.useState(false);


    function buildPosition() {
        let left = position.x;
        let top = position.y;

        if (position.x + (cardRef.current ? (cardRef.current as HTMLElement).offsetWidth : 0) + 20 > window.innerWidth) {
            left -= cardRef.current ? (cardRef.current as HTMLElement).offsetWidth + 15 : position.x;
        } else {
            left += 15;
        }

        if (position.y + (cardRef.current ? (cardRef.current as HTMLElement).offsetHeight : 0) + 20 > window.innerHeight) {
            top -= cardRef.current ? (cardRef.current as HTMLElement).offsetHeight + 15 : position.y;
        } else {
            top += 15;
        }

        return {left: left, top: top};
    }

    React.useEffect(() => {
        if (scrollableContainerRef.current && optionRef.current) {
            const scrollableContainer = scrollableContainerRef.current as HTMLElement;
            const option = optionRef.current as HTMLElement;

            const scrollableContainerRect = scrollableContainer.getBoundingClientRect();
            const optionRect = option.getBoundingClientRect();

            if (
                position.x >= scrollableContainerRect.left
                && position.x <= scrollableContainerRect.right
                && position.y >= scrollableContainerRect.top
                && position.y <= scrollableContainerRect.bottom
                && position.x >= optionRect.left
                && position.x <= optionRect.right
                && position.y >= optionRect.top
                && position.y <= optionRect.bottom
            ) {
                setShow(true);
            } else {
                setShow(false);
            }
        }
        
    }, [position]);

    return (<>

        <div ref={optionRef}>
            {children}
        </div>

        <div
            className={`${className} ${show ? 'opacity-100' : 'opacity-0'} fixed`}
            ref={cardRef}
            style={{   
                zIndex: zIndex
                , left: customX ? customX : buildPosition().left
                , top: customY ? customY : buildPosition().top
            }}
        >
            {content}
        </div>
    </>
    )
}

export { DataRowTable }