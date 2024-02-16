import React from "react";
import {
    Stepper,
} from "@chakra-ui/react";

import BasicStep from "./BasicStep";


export default function BasicStepper({
    currentIndex
    , orientation
    , children
}: {
    currentIndex: number
    , orientation: "horizontal" | "vertical"
    , children: any
}) {

    return (
        <Stepper index={currentIndex} orientation={orientation} height={'100%'}>
            {React.Children.map(children, (child, index) => {
                if (child.type !== BasicStep) {
                    throw new Error('BasicStepper only accepts BasicStep children');
                }

                return React.cloneElement(child, {
                    title: child.props.title,
                    index: index,
                });
            })}
        </Stepper>
    );
}

export { BasicStep }
