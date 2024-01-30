import React from "react";

import BasicStepper, { BasicStep } from "../BasicStepper/BasicStepper";
import MultiStepFormPage from "./MultiStepFormPage";
import { Button } from "@chakra-ui/react";

export default function MultiStepForm({
    className = ""
    , stepperOrientation
    , stepperHeight = "20rem"
    , children
    , onNext = () => true
    , onPrevious = () => true
}: {
    className?: string
    stepperOrientation: "horizontal" | "vertical"
    stepperHeight?: string
    children: any
    onNext?: (activeStep: number) => boolean
    onPrevious?: (activeStep: number) => boolean
}) {


    const [activeStep, setActiveStep] = React.useState(0);


    /* Methods */
    const handlePreviousClick = () => {
        if (activeStep <= 0) return;
        if (!onPrevious(activeStep)) return;

        setActiveStep(activeStep - 1);
    }

    const handleNextClick = () => {
        if (activeStep >= children.length) return;
        if (!onNext(activeStep)) return;

        setActiveStep(activeStep + 1);
        
    }


    return (<div className="flex gap-8">

        <div className="sticky">
            <BasicStepper currentIndex={activeStep} orientation={stepperOrientation} height={stepperHeight}>
                {React.Children.map(children, (child) => {
                    if (child.type !== MultiStepFormPage) {
                        throw new Error("MultiStepForm children must be of type MultiStepFormPage");
                    }

                    return <BasicStep title={child.props.title} description={child.props.description} />
                })}
            </BasicStepper>
        </div>


        <div className={`flex flex-col justify-between flex-grow p-4 ${className}`}>
            
            {React.Children.map(children, (child, index) => {
                return <div className={` ${index === activeStep ? '' : 'hidden'}`}>
                    {child}
                </div>
            })}

            <div className="flex justify-between items-center ">
                <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={handlePreviousClick}
                >
                    Previous
                </Button>

                <Button
                    colorScheme="blue"
                    onClick={handleNextClick}
                >
                    Next
                </Button>
            </div>


        </div>
    </div>);
}

export { MultiStepFormPage };