import React from "react";
import {
    Accordion,
} from "@chakra-ui/react";

import BasicAccordionItem from "./BasicAccordionItem";


export default function BasicAccordion({
    defaultIndex = [0]
    , allowMultiple = false
    , children
}: {
    defaultIndex?: number[]
    , allowMultiple?: boolean
    , children: any;
}) {
    return (<Accordion defaultIndex={defaultIndex} allowMultiple={allowMultiple} className="flex flex-col gap-6">
        {React.Children.map(children, (child) => {
            if (child.type != BasicAccordionItem) {
                throw new Error("BasicAccordion only accepts BasicAccordionItem as children");
            }

            return child;
        })}
    </Accordion>);
}

export { BasicAccordionItem };