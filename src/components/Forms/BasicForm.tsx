import React from "react";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Switch,
} from "@chakra-ui/react";
import { v4 } from "uuid";

import BasicFormField from "./BasicFormField";
import FormFieldWrapper from "../FormFieldWrapper/FormFieldWrapper";
import VirtualizedSelect from "../VirtualizedSelect/VirtualizedSelect";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import { DataRow, DataField } from "../../providers/data/models";

export default function BasicForm({
    row,
    readonly,
    children,
    onSave = () => {},
    onDelete = () => {},
}: {
    row: DataRow;
    readonly: boolean;
    children: React.ReactNode;
    onSave?: () => void;
    onDelete?: () => void;
}) {
    const [state, setState] = React.useState<DataRow>(new DataRow(row.tableName, row.json))


    /* Methods */
    const _changeState = (field: DataField, value: any) => {
        const newFormState = new DataRow(row.tableName, row.json);

        newFormState.setFieldValue(field, value);

        setState(newFormState);
        console.log(newFormState);
    };

    /* Handlers */
    const handleChange = (field: DataField, e: React.ChangeEvent<HTMLInputElement>) => {
        _changeState(field, e.target.value);
    };

    const handleStep = (field: DataField, operation: "sum" | "sub", stepVal: number = 1) => {
        const step = operation === "sum" ? stepVal : -stepVal;

        if (
            field.props.max &&
            Number(field.value) + step > Number(field.props.max)
        )
            return;
        if (
            field.props.min &&
            Number(field.value) + step < Number(field.props.min)
        )
            return;

        const value = Number(field.value) + step;

        _changeState(field, value);
    };

    const handleOptionClick = (field: DataField, option: DataField) => {
        _changeState(field, option.value);
    };

    const handleKeyDown = (field: DataField, e: React.KeyboardEvent) => {
        if (e.ctrlKey && e.key === "ArrowUp") {
            handleStep(field, "sum", 10);
        } else if (e.ctrlKey && e.key === "ArrowDown") {
            handleStep(field, "sub", 10);
        } else if (e.key === "ArrowUp") {
            handleStep(field, "sum");
        } else if (e.key === "ArrowDown") {
            handleStep(field, "sub");
        }
    };

    /* Methods */
    const buildFieldComponent = (field: DataField) => {
        const identifier = v4();
        const isDisabled = readonly ? true : !field.editable;

        let isInvalid: boolean = field.required && field.value === "";

        switch (field.type) {
            case "text":
            case "password":
            case "email":
                return (
                    <FormControl
                        id={identifier}
                        key={identifier}
                        isRequired={field.required}
                        isInvalid={isInvalid}
                    >
                        <FormLabel>{field.label}</FormLabel>
                        <Input
                            placeholder="Type..."
                            type={field.type}
                            value={String(field.value)}
                            onChange={(e) => handleChange(field, e)}
                            isDisabled={isDisabled}
                            minLength={field.props.minLength}
                            maxLength={field.props.maxLength}
                        />

                        <FormErrorMessage>
                            {field.errorMessage}
                        </FormErrorMessage>
                    </FormControl>
                );

            case "number":
                isInvalid =
                    (field.required && field.value === "") ||
                    Number(field.value) < field.props.min ||
                    Number(field.value) > field.props.max;

                return (
                    <FormControl
                        id={identifier}
                        key={identifier}
                        isRequired={field.required}
                        isInvalid={isInvalid}
                    >
                        <FormLabel>{field.label}</FormLabel>
                        <NumberInput
                            value={Number(field.value)}
                            min={field.props.min}
                            isDisabled={isDisabled}
                        >
                            <NumberInputField
                                onChange={(e) => handleChange(field, e)}
                                onKeyDown={(e) => handleKeyDown(field, e)}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper
                                    onClick={() => handleStep(field, "sum")}
                                />
                                <NumberDecrementStepper
                                    onClick={() => handleStep(field, "sub")}
                                />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>{field.helperMessage}</FormHelperText>
                        <FormErrorMessage>
                            {field.errorMessage}
                        </FormErrorMessage>
                    </FormControl>
                );

            case "boolean":
                return (
                    <FormControl
                        id={identifier}
                        key={identifier}
                        isRequired={field.required}
                        isInvalid={isInvalid}
                    >
                        <FormLabel>{field.label}</FormLabel>
                        <Switch
                            isChecked={Boolean(field.value)}
                            onChange={(e) => handleChange(field, e)}
                        />
                    </FormControl>
                );

            case "select":
                isInvalid = field.required && field.value === "";
                return (
                    <FormFieldWrapper
                        key={identifier}
                        label={field.label}
                        required={field.required}
                        isInvalid={isInvalid}
                        errorMessage={field.errorMessage}
                        helperMessage={field.props.helperMessage}
                    >
                        <VirtualizedSelect
                            field={field}
                            data={field.props.data}
                            disabled={isDisabled}
                            onOptionClick={handleOptionClick}
                        />
                    </FormFieldWrapper>
                );
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {React.Children.map(children, (child) => {
                if (
                    !React.isValidElement(child) ||
                    child.type !== BasicFormField
                ) {
                    throw new Error(
                        "BasicForm only accepts BasicFormField as children"
                    );
                }

                return buildFieldComponent(child.props.field);
            })}

            <div
                className={`flex ${
                    readonly ? "justify-between" : "justify-end"
                }`}
            >
                {readonly ? (
                    <>
                        <ConfirmationPopover onYes={onDelete}>
                            <Button colorScheme="red" variant="outline">
                                Delete
                            </Button>
                        </ConfirmationPopover>

                        {/* <Button colorScheme="blue" onClick={onSave}>Save</Button> */}
                    </>
                ) : (
                    <Button colorScheme="blue" onClick={onSave}>
                        Save
                    </Button>
                )}
            </div>
        </div>
    );
}

export { BasicFormField };
