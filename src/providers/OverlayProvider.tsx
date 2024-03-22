/* Foreign dependencies */
import React from 'react';
import { Spinner } from '@chakra-ui/react'

interface OverlayContextType {
    show: (opacity?: number) => void;
    hide: (delay?: number) => void;
}

export const OverlayContext = React.createContext<OverlayContextType | null>(null);

export function OverlayProvider({ children }) {
    const baseOpacity = 0.5;
    const [enabled, setEnabled] = React.useState<boolean>(false);
    const opacity = React.useRef<number>(baseOpacity)

    const show = (newOpacity: number = baseOpacity) => {
        setEnabled(true);
        opacity.current = newOpacity;
    };

    const hide = (delay = 250) => {
        setTimeout(() => {
            setEnabled(false);
            opacity.current = baseOpacity;
        }, delay);
    };

    return (
        <OverlayContext.Provider value={{ show, hide }}>
            <div style={{
                position: 'fixed',
                top: '0',
                width: '100%',
                height: '100%',
                backgroundColor: `rgba(255,255,255,${opacity.current})`,
                display: enabled ? 'block' : 'none',
                backdropFilter: 'blur(2px)',
                zIndex: 4999,
            }}>
                <Spinner size='xl' thickness='4px' color='blue.500' speed='0.65s' style={{ position: 'absolute', top: '50%', left: '50%' }} />
            </div>
            {children}
        </OverlayContext.Provider>
    );
}

export const useOverlay = () => {
    const context = React.useContext(OverlayContext);

    if (!context) {
        throw new Error('useOverlay must be used within a OverlayProvider');
    }
    return context; 
};