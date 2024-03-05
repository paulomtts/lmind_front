import React, { useRef } from "react";
import ReactDOM from "react-dom";

import DataRowTable from "./DataRowTable.js";
import { useMouse } from "../../providers/MouseProvider.jsx";


export default function HoverCard({
    className = "rounded-md bg-white border border-gray-300 shadow-md p-2"
    , zIndex = 5001
    , customX = 0
    , customY = 0
    , scrollableRef
    , content
    , children
}: {
    className?: string
    , zIndex?: number
    , customX?: number
    , customY?: number
    , scrollableRef: React.RefObject<HTMLDivElement>
    , content: React.ReactNode
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
        if (scrollableRef.current && optionRef.current) {
            const container = scrollableRef.current as HTMLElement;
            const option = optionRef.current as HTMLElement;

            const containerRect = container.getBoundingClientRect();
            const optionRect = option.getBoundingClientRect();

            if (
                position.x >= containerRect.left
                && position.x <= containerRect.right
                && position.y >= containerRect.top
                && position.y <= containerRect.bottom
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

        {ReactDOM.createPortal(
        <div
            className={`${className} ${show ? 'opacity-100' : 'opacity-0'} fixed`}
            ref={cardRef}
            style={{   
                zIndex: zIndex
                , left: customX ? customX : buildPosition().left
                , top: customY ? customY : buildPosition().top
                , boxShadow: "0 4px 7px 0px rgba(0,0,0,.25)"
            }}
        >
            {content}
        </div>, document.body)}
    </>)
}

export { DataRowTable }