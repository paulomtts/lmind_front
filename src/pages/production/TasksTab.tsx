import React from "react";

import MultiStepForm, { MultiStepFormPage } from "../../components/MultiStepForm/MultiStepForm";
import { Input } from "@chakra-ui/react";

export default function TasksTab({

}: {

}) {

    const handleOnNext = (activeStep: number) => {
        console.log(`Next clicked from step ${activeStep}`);
        return true;
    }

    const handleOnPrevious = (activeStep: number) => {
        console.log(`Previous clicked from step ${activeStep}`);
        return true;
    }

    return (<>
        <MultiStepForm
            className="bg-slate-100 rounded-md shadow-md border border-slate-300"
            stepperOrientation="vertical" 
            stepperHeight="calc(100vh - 4.6rem)" 
            onNext={handleOnNext} 
            onPrevious={handleOnPrevious}
        >
            <MultiStepFormPage title="Step 1" description="This is step 1, and it has this really long text associated with it.">
                <div className="flex flex-col gap-4">
                    <Input
                        bg={"white"}
                        placeholder="Basic usage"
                    />
                    <Input
                        bg={"white"}
                        placeholder="Basic usage"
                    />
                </div>

            </MultiStepFormPage>

            <MultiStepFormPage title="Step 2" description="This is step 2">
                <span>Step 2 content goes here</span>
            </MultiStepFormPage>

            <MultiStepFormPage title="Step 3" description="This is step 3, and it also has a demonstrably large body attached to it.">
                <span>Step 3</span>
            </MultiStepFormPage>
        </MultiStepForm>
    </>);
}