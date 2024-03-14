import React from "react";

import BasicStepper, { BasicStep } from "../BasicStepper/BasicStepper";
import MultiStepFormPage from "./MultiStepFormPage";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import { Button } from "@chakra-ui/react";


export default function MultiStepForm({
    className = ""
    , readonly = false
    , children
    , onNext = () => true
    , onPrevious = () => true
    , onSave = undefined
    , onDelete = undefined
}: {
    className?: string
    readonly?: boolean
    children: any
    onNext?: (activeStep: number) => boolean
    onPrevious?: (activeStep: number) => boolean
    onSave?: () => void
    onDelete?: () => void
}) {

    const thisRef = React.useRef<HTMLDivElement>(null);

    const [height, setHeight] = React.useState<number>(0);
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


    /* Effects */
    React.useEffect(() => {
        const handleResize = () => {
            if (thisRef.current) {
                const newHeight = thisRef.current?.parentElement?.parentElement?.clientHeight;
                setHeight(newHeight??0);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [thisRef]);


    return (
    <div className="flex gap-8 h-full" ref={thisRef} style={{maxHeight: height - 90}}>

        <div className="sticky">
            <BasicStepper currentIndex={activeStep} orientation={'vertical'}>
                {React.Children.map(children, (child) => {
                    if (child.type !== MultiStepFormPage) {
                        throw new Error("MultiStepForm children must be of type MultiStepFormPage");
                    }

                    return <BasicStep title={child.props.title} description={child.props.description} />
                })}
            </BasicStepper>
        </div>


        <div className={`flex flex-col flex-grow justify-between gap-4${className}`}>
            
            {React.Children.map(children, (child, index) => {
                return <div className={` ${index === activeStep ? 'overflow-y-auto' : 'hidden'}`}>
                    <div className="mr-2">
                        {child}
                    </div>
                </div>
            })}

            <div className="flex justify-between items-center">
                <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={handlePreviousClick}
                    isDisabled={activeStep <= 0}
                >
                    Previous
                </Button>

                <div className="flex gap-2">
                    {onDelete && activeStep > children.length -2 && 
                        <ConfirmationPopover onYes={onDelete}>
                            <Button variant='outline' colorScheme="red">
                                Delete
                            </Button>
                        </ConfirmationPopover>
                    }

                    {activeStep <= children.length -2 ?
                        <Button
                            colorScheme="blue"
                            onClick={handleNextClick}
                        >
                            Next
                        </Button>
                        :
                        
                        !readonly && <Button
                            colorScheme="blue"
                            onClick={onSave}
                        >
                            Save
                        </Button>
                    }
                </div>
            </div>
        </div>
    </div>);
}

export { MultiStepFormPage };