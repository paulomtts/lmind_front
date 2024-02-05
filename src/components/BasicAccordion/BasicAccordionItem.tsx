import React from "react";
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from "@chakra-ui/react";

export default function BasicAccordionItem({
    title
    , description
    , children
}: {
    title: string;
    description?: string;
    children: any;
}) {

    return (<>
        <AccordionItem style={{borderTopWidth: 0, borderBottomWidth: 0}}
            _expanded={{
                marginBottom: '1rem'
                , transition: 'margin 0.2s ease-in-out'
            }}
        >

            {description && <p className="text-gray-400 text-sm mb-2 ml-1">
                {description}
            </p>}

            <AccordionButton 
                className="border border-slate-300 bg-slate-50 rounded-md mb-1.5"
                _expanded={{ 
                    bg: 'rgba(97, 113, 141, 0.25)'
                    , boxShadow: '0 2px 3px 0px rgba(0,0,0,0.5)'
                    , transition: 'box-shadow 0.2s ease-in-out'
                }}
                title="Click to expand or collapse"
            >
                <Box as="span" textAlign="left" flex={1}>
                    {title}
                </Box>
                <AccordionIcon />
            </AccordionButton>

            <AccordionPanel p={4} className="border border-slate-300 rounded-md mb-4 shadow-lg" >
                {children}
            </AccordionPanel>

        </AccordionItem>
    </>);
}