import React from "react";

export default function MultiStepFormPage({
    title
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