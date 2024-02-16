import React from 'react';
import BasicBadge from "./BasicBadge";

export default function BadgeBox({
    className,
    children
}: {
    className?: string;
    children?: React.ReactNode;
}) {

    const colors = ["teal", "red", "yellow", "purple", "blue", "pink", "orange"];
    const currColorIndex = React.useRef(0);

    React.useEffect(() => {
        currColorIndex.current = 0;
    }, [children]);

    const getNextColor = () => {
        const color = colors[currColorIndex.current];
        currColorIndex.current = (currColorIndex.current + 1) % colors.length;
        return color;
    }

    return (
        <div className={`
            flex flex-wrap content-start gap-1 
            overflow-y-auto
            border rounded-md border-gray-300 p-1.5 
            resize-y ${className}
        `}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type !== BasicBadge) {
                        throw new Error("BadgeBox only accepts BasicBadge as children");
                    }

                    const newChild = React.cloneElement(child as React.ReactElement<any>, {
                        colorScheme: getNextColor()
                    });
                    return newChild;
                }
                return child;
            })}
        </div>
    )
}
