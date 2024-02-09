import React from "react";
import { 
    Button
    , Input
    , InputGroup
    , InputRightElement

    , FormControl
    , FormLabel
    , FormErrorMessage
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


export default function ClearableInput({
    value
    , label = ''
    , placeholder = "Search..."
    , required = false
    , disabled
    , errorMessage
    , children
    , onClick = () => { }
    , onChange = () => { }
    , onClear = () => { }
    , onBlur = () => { }
    , onFocus = () => { }
}: {
    value: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    errorMessage?: string
    children?: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
    onBlur?: () => void
    onFocus?: () => void
}) {

    const inputRef = React.useRef<HTMLInputElement>(null!);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [isInvalid, setIsInvalid] = React.useState<boolean>(true);


    /* Effects */
    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    React.useEffect(() => {
        if (inputValue === '') {
            setIsInvalid(true);
        } else {
            setIsInvalid(false);
        }
    }, [inputValue]);


    /* Handlers */
    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        inputRef.current.select();
        onClick(e);
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

    return (<>
        <FormControl isInvalid={!!errorMessage && isInvalid} isDisabled={disabled}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <InputGroup>
                <Input 
                    ref={inputRef}
                    placeholder={placeholder}
                    value={inputValue}
                    required={required}
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
                <InputRightElement className="pr-1 m-0">
                    <Button
                        variant="ghost" 
                        size="sm" 
                        tabIndex={0}
                        isDisabled={disabled}
                        onClick={handleClearClick}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </InputRightElement>
            </InputGroup>

            {children}

            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    </>);
}