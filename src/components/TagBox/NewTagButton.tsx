import React from "react";
import { Button } from "@chakra-ui/react";
import { faTags, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure } from "@chakra-ui/react";

import BasicPopover from "../BasicPopover/BasicPopover";

export default function NewTagButton({
    tagForm
    , className
    , children
    , onClick
}: {
    tagForm: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
    onClick: () => void;
}) {

    return (
        <BasicPopover content={tagForm} focusContent>
            <Button
                onClick={onClick}
                className={`flex items-center gap-2 ${className}`}
                colorScheme="blue"
                size="sm"
                variant="outline"
                >
                <FontAwesomeIcon icon={faTags} />
                New Tag
            </Button>
        </BasicPopover>
    );
}