import React from "react";
import {
    InputGroup
    , Input
    , InputRightElement
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


export default function SelectSearch({
    inputValue
    , handleInputChange = () => {}
}: {
    inputValue: string
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
            value={inputValue}
            onChange={handleInputChange}
        />
        <InputRightElement>
            <FontAwesomeIcon className="text-slate-500 text-sm" icon={faSearch} />
        </InputRightElement>
    </InputGroup>
    );
}