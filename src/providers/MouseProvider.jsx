import { useState, useEffect, useContext, createContext } from 'react';


export const MouseContext = createContext();

export function MouseProvider({ children }) {

    const [position, setPosition] = useState({ x: null, y: null });

    useEffect(() => {
        window.addEventListener('mousemove', updateMousePosition);

        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    const updateMousePosition = e => {
        setPosition({ x: e.clientX, y: e.clientY });
        // console.log({ x: e.clientX, y: e.clientY, windowWidth: window.innerWidth, windowHeight: window.innerHeight })
    }

    return (
        <MouseContext.Provider value={{position}}>
            {children}
        </MouseContext.Provider>
    );
}

export const useMouse = () => {
    return useContext(MouseContext);
};