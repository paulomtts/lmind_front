import React, { useRef } from "react";

import { useMouse } from "../../providers/mouse.jsx";


export default function HoverCard({
    customX = null
    , customY = null
}) {

    const { mousePosition } = useMouse();
    const cardRef = useRef(null);

    function buildPosition() {
        let left = mousePosition.x;
        let top = mousePosition.y;

        if(mousePosition.x > window.innerWidth / 2) {
            left -= 515;
        } else {
            left += 30;
        }

        if(mousePosition.y > window.innerHeight / 2) {
            top -= cardRef.current ? cardRef.current.offsetHeight + 15 : mousePosition.y;
        } else {
            top += 30;
        }

        return {left: left, top: top};
    }

    return (
        <div
            className="bg-white border border-gray-300 shadow-lg p-5"
            ref={cardRef}
            style={
                {
                    width: '500px'
                    , height: 'fit-content'
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
            This is a card
        </div>
    )
}