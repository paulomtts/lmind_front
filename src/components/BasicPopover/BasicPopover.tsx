import React from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Box,
    useDisclosure
} from "@chakra-ui/react";

export default function BasicPopover({
    content
    , focusContent
    , children
}: {
    content: React.ReactNode;
    focusContent?: boolean;
    children: React.ReactNode;
}) {

    const { isOpen } = useDisclosure();

    return (<>
        <Popover isOpen={isOpen}>
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
                    {React.cloneElement(content as React.ReactComponentElement<any>, {
                        isopen: isOpen
                    })}
                </PopoverBody>
            </PopoverContent>
        </Popover>
        {isOpen && focusContent && (
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
