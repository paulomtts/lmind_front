import React, { useRef } from "react";

import { useMouse } from "../../providers/MouseProvider.jsx";


export default function HoverCard({
    customX = null
    , customY = null
    , children
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
            className="bg-white border border-gray-300 shadow-md p-2"
            ref={cardRef}
            style={
                {
                    // width: 'auto'
                    height: 'fit-content'
                    , position: 'fixed'
                    , zIndex: 1001
                    , left: customX ?
                        customX
                        :
                        buildPosition().left
                    , top: customY ?
                        customY
                        : 
                        buildPosition().top
                    , display: cardRef.current ? 'block' : 'none'
                }
            }
        >
            {children}
        </div>
    )
}