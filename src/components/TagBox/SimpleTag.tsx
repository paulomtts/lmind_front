import React from "react";
import {
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";


export default function SimpleTag({
    label
    , size = "sm"
    , variant = "solid"
    , colorScheme = "blackAlpha"
    , children
    , onClose
}: {
    label: string;
    size?: "sm" | "md" | "lg";
    variant?: "subtle" | "solid" | "outline";
    colorScheme?: "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "linkedin" | "facebook" | "messenger" | "whatsapp" | "twitter" | "telegram"
    children?: React.ReactNode;
    onClose?: () => void;
}) {

    let closeButtonStyle: string = "";
        
    switch (size) {
        case "sm":
            closeButtonStyle = "scale-75 m-0.5";
            break;
        case "md":
            closeButtonStyle = "scale-95 m-1";
            break;
        case "lg":
            closeButtonStyle = "scale-110";
            break;
    }

    if (variant === "solid") {
        closeButtonStyle += " bg-white text-black";
    }

    return (
        <Tag
            size={size}
            borderRadius='full'
            variant={variant}
            colorScheme={colorScheme}
            className="h-fit flex items-center"
        >
            {children}
            <TagLabel>{label}</TagLabel>
            {onClose && <TagCloseButton className={closeButtonStyle} onClick={onClose} />}
        </Tag>
    )
}