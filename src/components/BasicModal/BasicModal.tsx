import React from 'react';
import {
    Modal
    , ModalOverlay
    , ModalContent
    , ModalHeader
    , ModalCloseButton
    , ModalFooter
    , ModalBody
} from '@chakra-ui/react'

import BasicModalFooter from './BasicModalFooter';


export default function BasicModal({
    title
    , size
    , width
    , height
    , blur = false
    , children
    , isOpen = false
    , className = ''
    , onClose = () => {}
}: {
    title: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    width?: string;
    height?: string;
    blur?: boolean;
    isOpen?: boolean;
    className?: string;
    children: React.ReactNode;
    onClose?: () => void;
}) {

    if (size && width) {
        throw new Error('cannot set both size and width. Use either one or the other.');
    }

    const [footerChildren, setFooterChildren] = React.useState<React.ReactNode[]>([]);

    React.useEffect(() => {
        const footerChildren = React.Children.toArray(children).filter((child) => {
            return (child as React.ReactElement).type === BasicModalFooter;
        });

        setFooterChildren(footerChildren);
    }, [children]);
    
    return (<Modal isOpen={isOpen} isCentered size={size ? size : 'xl'} onClose={() => {}}> {/* reason: prevent close when clicking outside Modal */}
        <ModalOverlay backdropFilter={blur ? 'blur(2px)' : 'none'} />

        <ModalContent maxW={width ? width : undefined} width={'fit-content'} minW={'40%'} minH={height} className={className}>
            <ModalCloseButton onClick={onClose}/>
            <ModalHeader color='gray.500'>
                {title}
            </ModalHeader>

            <ModalBody className='mb-2'>
                {React.Children.toArray(children).filter((child) => {
                    return (child as React.ReactElement).type !== BasicModalFooter;
                })}
                
            </ModalBody>

            {footerChildren.length > 0 && <ModalFooter className='flex justify-between mb-2'>
                {footerChildren}
            </ModalFooter>}
        </ModalContent>
    </Modal>);
}

export {
    BasicModalFooter
}