import React from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Box,
    useDisclosure
} from "@chakra-ui/react";

export default function BasicPopover({
    content
    , focus
    , triggerIsOpen = false
    , children
}: {
    content: React.ReactNode;
    focus?: boolean;
    triggerIsOpen?: boolean;
    children: React.ReactNode;
}) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    React.useEffect(() => {
        console.log('triggered')
    }, [triggerIsOpen]);

    return (<>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent width={'auto'} borderRadius={'0.35rem'} zIndex={'popover'}>
                <PopoverArrow/>
                <PopoverBody 
                    boxShadow={'0px 3px 10px 1px rgba(0,0,0,0.75)'}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <PopoverCloseButton />
                    <div className="flex flex-col gap-2 mt-6">
                        {content}
                    </div>
                </PopoverBody>
            </PopoverContent>
        </Popover>
        {isOpen && focus && (
            <Box
                position="fixed"
                top={0}
                right={0}
                bottom={0}
                left={0}
                bg="blackAlpha.600"
                backdropFilter={'blur(2px)'}
                zIndex="1"
            />
        )}
    </>);
}
