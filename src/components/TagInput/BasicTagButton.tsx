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
    useDisclosure,
} from "@chakra-ui/react";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function BasicTagButton({
    title = "New Tag"
    , label = "New Tag"
    , children
    , onSubmit
}: {
    title?: string
    label?: string
    children?: React.ReactNode;
    onSubmit: () => void;
}) {


    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmitClick = () => {
        onSubmit();
        onClose();
    }

    return (<>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
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
