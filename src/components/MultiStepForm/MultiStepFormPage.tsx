import React from "react";

export default function MultiStepFormPage({
    title
    , description
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