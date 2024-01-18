import React from "react";
import { 
    Button
    , Input
    , InputGroup
    , InputRightElement
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { DataField } from "../../providers/data/dataModels";


export default function BasicInput({
    field
    , placeholder = "Search..."
    , required
    , onClick = () => { }
    , onChange = () => { }
    , onClear = () => { }
    , onBlur = () => { }
}: {
    field?: DataField | undefined
    placeholder?: string
    required?: boolean
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
    onBlur?: () => void
}) {

    const inputRef = React.useRef<HTMLInputElement>(null!);
    const [inputValue, setInputValue] = React.useState('');


    /* Effects */
    React.useEffect(() => {
        if (!field) return;
        setInputValue(String(field.value ?? ''));
        onChange({ target: { value: field.value ?? '' } } as React.ChangeEvent<HTMLInputElement>);
    }, [field]);


    /* Handlers */
    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        onClick(e);
        inputRef.current.select();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e);
    }

    const handleClearClick = () => {
        setInputValue('');
        onClear();
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setInputValue('');
            onClear();
        }
    }

    return (<InputGroup>
        <Input 
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            isRequired={required}
            onClick={handleInputClick}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={onBlur}
        />
        <InputRightElement className="pr-1 m-0">
            <Button
                variant="ghost" 
                size="sm" 
                tabIndex={0}
                onClick={handleClearClick}
            >
                <FontAwesomeIcon icon={faXmark} />
            </Button>
        </InputRightElement>
    </InputGroup>);
}