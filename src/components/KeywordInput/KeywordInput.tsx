import React from "react";
import { 
    Button
    , FormControl
    , FormErrorMessage, FormLabel
    , Input 
    , InputGroup
    , InputRightElement
    , Tooltip
} from "@chakra-ui/react";
import { CheckIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import BasicBadge from "./BasicBadge";
import BadgeBox from "./BadgeBox";

export default function KeywordInput({
    data = []
    , className
    , onSubmit
}: {
    data?: string[];
    className?: string;
    onSubmit: (keywords: string[]) => void;
}) {

    const [value, setValue] = React.useState('');
    const [keywords, setKeywords] = React.useState<string[]>(data);
    const [isInvalid, setIsInvalid] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (value.trim() === '') return;
        if (keywords.includes(value.trim())) return;

        setKeywords([...keywords, value]);
        setValue('');

        onSubmit([...keywords, value]);

        inputRef.current?.focus();
    }

    const handleDelete = (index: number) => {
        const filteredKeywords = keywords.filter((_, i) => i !== index);
        setKeywords(filteredKeywords);

        onSubmit(filteredKeywords);
    }

    const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lowerCaseKeywords = keywords.map(k => k.toLowerCase());
        if (lowerCaseKeywords.includes(e.target.value.toLowerCase().trim())) {
            setIsInvalid(true);
        } else {
            setIsInvalid(false);
        }
        setValue(e.target.value);
    }

    const handleInputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <FormControl className="flex flex-col gap-4">
            <div>
                <FormLabel>Keywords</FormLabel>
                <p>
                    Add keywords to help others find your resource
                </p>
            </div>

            <div className='flex flex-col gap-2'>
                
                <div className='flex items-center gap-2'>
                    <InputGroup size="md">
                        <FormControl isInvalid={isInvalid}>
                            <Input 
                                ref={inputRef}
                                value={value}
                                placeholder="Type..." 
                                onChange={handleInputOnChange}
                                onKeyDown={handleInputOnKeyDown}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleSubmit} isDisabled={isInvalid}>
                                    <CheckIcon color={'green'} />
                                </Button>
                            </InputRightElement>
                            <FormErrorMessage>Keyword already exists</FormErrorMessage>
                        </FormControl>
                    </InputGroup>


                    <Tooltip hasArrow label="Press Enter to add a keyword and reset" aria-label="A tooltip">
                        <QuestionOutlineIcon color={'gray'} />
                    </Tooltip>
                </div>

                <BadgeBox className={className}>
                    {keywords.map((keyword, i) => (
                        <BasicBadge key={i} label={keyword} index={i} onDelete={handleDelete} />
                    ))}
                </BadgeBox>
            </div>
        </FormControl>
    );
}

export { BasicBadge as SimpleTag };