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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

export default function ConfirmationPopover({
    text = 'Are you sure?',
    onYes = ()=> {},
    children
}) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (<>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent width={'auto'} borderRadius={'0.35rem'}>
                <PopoverCloseButton  visibility={'hidden'}/>
                <PopoverArrow/>
                <PopoverBody 
                    borderRadius={'0.35rem'} 
                    boxShadow={'0px 1px 5px 0px rgba(0,0,0,0.75)'}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <span>{text}</span>
                    <Box display={'flex'} gap={'0.5rem'}>
                        <Button colorScheme="red" size='sm' variant={'outline'} onClick={onYes}>Yes</Button>
                        <Button colorScheme="blue" size='sm' onClick={onClose}>No</Button>
                    </Box>
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
    </>);
}
