import React from "react";
import {
    Stepper,
} from "@chakra-ui/react";

import BasicStep from "./BasicStep";


export default function BasicStepper({
    currentIndex
    , orientation
    , height
    , children
}: {
    currentIndex: number
    , orientation: "horizontal" | "vertical"
    , height?: string
    , children: any
}) {

    return (
        <Stepper index={currentIndex} orientation={orientation} height={height}>
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, {
                    title: child.props.title,
                    index: index,
                });
            })}
        </Stepper>
    );
}

export { BasicStep }
