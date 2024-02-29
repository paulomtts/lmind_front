/* Foreign dependencies */
import React from 'react';
import { Spinner } from '@chakra-ui/react'


export const OverlayContext = React.createContext(null);

export function OverlayProvider({ children }) {
    
    const baseOpacity = 0.5;
    const [enabled, setEnabled] = React.useState(false)
    const [opacity, setOpacity] = React.useState(baseOpacity)

    const style = {
        position: 'fixed',
        top: '0',
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(255,255,255,${opacity})`,
        display: enabled ? 'block' : 'none',
        backdropFilter: 'blur(2px)',
        zIndex: 4999,
    };

    const show = (opacity = baseOpacity) => {
        setEnabled(true);
        setOpacity(opacity);
    };

    const hide = (delay = 250) => {
        setTimeout(() => {
            setEnabled(false);
            setOpacity(baseOpacity);
        }, delay);
    };

    return (
        <OverlayContext.Provider value={{ show, hide }}>
            <div style={style}>
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