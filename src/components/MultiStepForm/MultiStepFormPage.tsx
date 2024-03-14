import React from "react";

export default function MultiStepFormPage({
    title // DO NOT ERASE, reason: used in the MultiStepForm component
    , description // DO NOT ERASE, reason: used in the MultiStepForm component
    , children
}: {
    title: string
    , description: string
    , children: any
}) {
    return (<>
        {children}
    </>);
}