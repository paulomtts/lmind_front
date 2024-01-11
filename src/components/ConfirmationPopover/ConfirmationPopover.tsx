import React, { useRef } from "react";
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

export default function ConfirmationPopover({
    text = 'Are you sure?',
    onYes = ()=> {},
    children
}) {

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleNoClick = () => {
        if (closeButtonRef.current) {
            closeButtonRef.current.click();
        }
    }

    return (<>
        <Popover>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent width={'auto'} borderRadius={'0.35rem'}>
                <PopoverCloseButton ref={closeButtonRef} visibility={'hidden'}/>
                <PopoverArrow/>
                <PopoverBody 
                    borderRadius={'0.35rem'} 
                    boxShadow={'0px 3px 10px 1px rgba(0,0,0,0.75)'}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <span>{text}</span>
                    <Box display={'flex'} gap={'0.5rem'}>
                        <Button colorScheme="red" size='sm' variant={'outline'} onClick={onYes}>Yes</Button>
                        <Button colorScheme="blue" size='sm' onClick={handleNoClick}>No</Button>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </>);
}
