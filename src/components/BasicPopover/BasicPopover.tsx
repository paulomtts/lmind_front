import React from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
} from "@chakra-ui/react";

export default function BasicPopover({
    children,
    content
}) {
    return (<>
        <Popover>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent width={'auto'} borderRadius={'0.35rem'}>
                <PopoverCloseButton />
                <PopoverArrow/>
                <PopoverBody 
                    borderRadius={'0.35rem'} 
                    boxShadow={'0px 3px 10px 1px rgba(0,0,0,0.75)'}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                    paddingTop={'1.75rem'}
                >
                    {content}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </>);
}
