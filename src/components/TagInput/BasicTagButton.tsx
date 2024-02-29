import React from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
    Button,
    Box,
    Kbd,
    useDisclosure,
} from "@chakra-ui/react";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DataRow } from "../../providers/data/models";
import configs from "./configs.json";
import { TProdProductTags } from "../../providers/data/routes/TProd";


export default function BasicTagButton({
    row
    , title = "New Tag"
    , label = "New Tag"
    , type
    , children
    , onSubmit = () => {}
}: {
    row: DataRow
    title?: string
    label?: string
    type: 'product' | 'order'
    children?: React.ReactNode;
    onSubmit?: (row: DataRow, isAvailable: boolean) => void;
}) {

    const map = {
        product: TProdProductTags.checkAvailability
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isAvailable, setIsAvailable] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [memoryTag, setMemoryTag] = React.useState<string>('');

    const handleSubmitClick = async () => {
        const newMemoryTag = Object.values(row.json).join('');
        setMemoryTag(newMemoryTag);

        const checkAvailability = map[type];

        const { response, data } = await checkAvailability(row);
        const isAvailable = data.available;
        
        if (response.ok) {
            setIsAvailable(isAvailable);
            setMessage(data.message);

            if (isAvailable === false) {
                const newTag = new DataRow('', data.object, configs[type]);
                onSubmit(newTag, isAvailable);
            } else {
                onSubmit(row, isAvailable);
            }

        }
        
        if (isAvailable) onClose();
    }


    return (<>
        <Popover isOpen={isOpen} onOpen={onOpen}>
            <PopoverTrigger>
                <Button
                    size="md"
                    colorScheme="blue"
                    variant="outline"
                >
                    <div className="flex items-center gap-2 pl-2 pr-2">
                        <FontAwesomeIcon icon={faTags} />
                        {label}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent width={'auto'} borderRadius={'0.35rem'}>
                <PopoverCloseButton visibility={'hidden'}/>
                <PopoverArrow />
                <PopoverBody 
                    boxShadow={'0px 1px 5px 0px rgba(0,0,0,0.75)'}
                >
                    <div className="flex flex-col gap-2 w-80">

                        <span className="text-lg text-slate-500">{title}</span>

                        <>
                            {children}
                        </>

                        {message !== '' && <div className="
                            bg-slate-50 rounded-md 
                            p-2 mt-2 border 
                            border-slate-300 
                            flex flex-col gap-4
                        ">
                            <p className={`${isAvailable ? ' text-green-800' : 'text-gray-500'} text-sm text-center`}>
                                <Kbd style={{fontSize: '0.9rem'}}>{memoryTag}</Kbd> {message}
                            </p>
                        </div>}

                        <div className="flex justify-between gap-2 mt-2">
                            <Button variant='outline' colorScheme="red" size="sm" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" size="sm" onClick={handleSubmitClick}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </PopoverBody>
            </PopoverContent>
        </Popover>
        {isOpen && <Box
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="blackAlpha.600"
            backdropFilter={'blur(2px)'}
            zIndex="1"
        />}
    </>
    );
}
