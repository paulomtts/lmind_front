import React from "react";

export default function FormFieldWrapper({
    label
    , required
    , errorMessage
    , helperMessage
    , currField
    , children
}: {
    label?: string
    required?: boolean
    errorMessage?: string
    helperMessage?: string
    currField?: any
    children?: React.ReactNode

}) {
    return (<div className="flex flex-col">

        {!!label && <p className="chakra-form__label css-g6pte">{label}<span className="chakra-form__required-indicator css-1tfjd1n">{required ? '*': ''}</span></p>}

        {children}

        {!!helperMessage && <p className="chakra-form__helper-text css-1yjw6w3">{helperMessage}</p>}

        {!currField?.required && !currField?.value && <p className="chakra-form__error-message css-502kp3">{errorMessage}</p>}
    </div>)
}