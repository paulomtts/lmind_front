import React from "react";
import SimpleTag from "./SimpleTag";

export default function SimpleTagBox({
    randomColors = false
    , className
    , children
}: {
    randomColors?: boolean;
    className?: string;
    children?: React.ReactNode;
}) {

    const colors = ["teal", "red", "yellow", "purple", "blue", "pink", "orange"];
    const currColor = React.useRef(randomColors ? Math.floor(Math.random() * colors.length) : 0);

    const incrementColor = () => {
        currColor.current = (currColor.current + 1) % colors.length;
    }

    return (
        <div className={`flex flex-wrap content-start gap-1 overflow-y-auto border rounded-md border-gray-300 p-1.5 resize-y ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    const newChild = React.cloneElement(child as React.ReactElement<any>, {
                        colorScheme: randomColors ? colors[currColor.current] : child.props.colorScheme
                    });
                    if (randomColors) incrementColor();
                    return newChild;
                }
                return child;
            })}
        </div>
    );
}

export { SimpleTag };