import React from "react";
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Box,
} from "@chakra-ui/react";

export default function BasicStep({
    index = 0
    , title
    , description
}: {
    index?: number
    , title: string
    , description: string
}) {

    return (
    <Step key={index}>
        <StepIndicator>
            <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
            />
        </StepIndicator>

        <Box flexShrink="0">
            <StepTitle><span className="select-none">{title}</span></StepTitle>
            <StepDescription style={{maxWidth: '6rem'}}><span className="select-none">{description}</span></StepDescription>
        </Box>

        <StepSeparator />
    </Step>
    );
}
