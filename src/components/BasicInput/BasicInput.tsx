import React from "react";
import { 
    Button,
    Input
    , InputGroup
    , InputRightElement
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function SelectInput({
    placeholder = "Search..."
    , onClick = () => { }
    , onChange = () => { }
    , onClear = () => { }
    , onBlur = () => { }
}: {
    placeholder?: string
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
    onBlur?: () => void
}) {

    const [inputValue, setInputValue] = React.useState('');

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
            placeholder={placeholder}
            value={inputValue}
            onClick={onClick}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={onBlur}
        />
        <InputRightElement 
            className="pr-1 m-0"
            >
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