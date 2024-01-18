import React, { useRef } from "react";

import { useMouse } from "../../providers/MouseProvider.jsx";


export default function HoverCard({
    className = "rounded-md bg-white border border-gray-300 shadow-md p-2 fixed"
    , zIndex = 1001
    , customX = 0
    , customY = 0
    , children
}: {
    className?: string
    , zIndex?: number
    , customX?: number
    , customY?: number
    , children: React.ReactNode
}) {

    const { position } = useMouse();
    const cardRef = useRef(null);

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

    return (
        <div
            className={`${className}`}
            ref={cardRef}
            style={{   
                zIndex: zIndex
                , left: customX ? customX : buildPosition().left
                , top: customY ? customY : buildPosition().top
            }}
        >
            {children}
        </div>
    )
}