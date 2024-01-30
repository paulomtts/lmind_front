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
        <MultiStepForm stepperOrientation="vertical" stepperHeight="calc(100vh - 4.6rem)" onNext={handleOnNext} onPrevious={handleOnPrevious}>
            <MultiStepFormPage title="Step 1" description="This is step 1, and it has this really long text associated with it.">
                <Input
                    placeholder="Basic usage"
                />
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