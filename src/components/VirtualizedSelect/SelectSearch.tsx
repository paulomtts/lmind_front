import React from "react";
import {
    InputGroup
    , Input
    , InputRightElement
    , Button
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


export default function SelectSearch({
    value
    , onChange: handleInputChange = () => {}
    , onKeyDown: handleInputKeyPress = () => {}
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {

    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        inputRef.current?.select();
    }, [inputRef]);

    return (
    <InputGroup 
        className="bg-white p-1"
    >
        <Input
            id="search"
            ref={inputRef}
            placeholder={'Search...'} 
            fontSize={'sm'}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
        />
        <InputRightElement>
            <FontAwesomeIcon className="text-slate-500 text-sm mt-2" icon={faSearch} />
        </InputRightElement>
    </InputGroup>
    );
}