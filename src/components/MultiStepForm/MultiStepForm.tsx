import React from "react";

import BasicStepper, { BasicStep } from "../BasicStepper/BasicStepper";
import MultiStepFormPage from "./MultiStepFormPage";
import { Button } from "@chakra-ui/react";

export default function MultiStepForm({
    className = ""
    , stepperOrientation
    , stepperHeight: stepperMaxHeight = "20rem"
    , children
    , onNext = () => true
    , onPrevious = () => true
    , onSave = () => true
}: {
    className?: string
    stepperOrientation: "horizontal" | "vertical"
    stepperHeight?: string
    children: any
    onNext?: (activeStep: number) => boolean
    onPrevious?: (activeStep: number) => boolean
    onSave?: () => void
}) {


    const [activeStep, setActiveStep] = React.useState(0);


    /* Methods */
    const handlePreviousClick = () => {
        if (activeStep <= 0) return;
        if (!onPrevious(activeStep)) return;

        setActiveStep(activeStep - 1);
    }

    const handleNextClick = () => {
        if (activeStep >= children.length -1) return;
        if (!onNext(activeStep)) return;

        setActiveStep(activeStep + 1);   
    }

    const handleSaveClick = () => {
        onSave();
    }


    return (<div className="flex gap-8">

        <div className="sticky">
            <BasicStepper currentIndex={activeStep} orientation={stepperOrientation} maxHeight={stepperMaxHeight}>
                {React.Children.map(children, (child) => {
                    if (child.type !== MultiStepFormPage) {
                        throw new Error("MultiStepForm children must be of type MultiStepFormPage");
                    }

                    return <BasicStep title={child.props.title} description={child.props.description} />
                })}
            </BasicStepper>
        </div>


        <div className={`flex flex-col justify-between flex-grow gap-4 ${className}`}>
            
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
                    isDisabled={activeStep <= 0}
                >
                    Previous
                </Button>

                <Button
                    colorScheme="blue"
                    onClick={
                        activeStep <= children.length -2 ? handleNextClick : handleSaveClick
                    }
                >
                    {activeStep <= children.length -2 ? "Next" : "Save"}
                </Button>
            </div>


        </div>
    </div>);
}

export { MultiStepFormPage };