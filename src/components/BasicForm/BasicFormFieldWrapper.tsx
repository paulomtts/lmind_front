import React from "react";

export default function FormFieldWrapper({
    label
    , required
    , isInvalid
    , errorMessage
    , helperMessage
    , children
}: {
    label?: string
    , required?: boolean
    , isInvalid?: boolean
    , errorMessage?: string
    , helperMessage?: string
    , children?: React.ReactNode

}) {
    return (<div className="flex flex-col">

        {!!label && <p className="chakra-form__label css-g6pte">{label}<span className="chakra-form__required-indicator css-1tfjd1n">{required ? '*': ''}</span></p>}

        {children}

        <div className="flex flex-col gap-1">
            {isInvalid && <p className="chakra-form__error-message css-502kp3">{errorMessage}</p>}

            {!!helperMessage && <p className={`${!isInvalid ? 'mt-2' : ''} text-sm text-slate-500 chakra-form__helper-text css-1yjw6w3`}>{helperMessage}</p>}
        </div>

    </div>)
}