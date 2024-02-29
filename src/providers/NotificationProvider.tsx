/* Foreign dependencies */
import React from 'react';
import { useToast } from '@chakra-ui/react'


export default class Toast {
    static success: 'success' = 'success';
    static info: 'info' = 'info';
    static warning: 'warning' = 'warning';
    static error: 'error' = 'error';

    title: string;
    description: string;
    status: 'info' | 'warning' | 'success' | 'error'
    duration: number;
    isClosable: boolean;
    
    constructor(
        title: string
        , description: string
        , status: 'info' | 'warning' | 'success' | 'error'
        , duration: number = 4000
        , isClosable: boolean = true
    ) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.duration = duration;
        this.isClosable = isClosable;
    }
}


export const NotificationContext = React.createContext<any>(null);

export function NotificationProvider({ children }) {
    
    const toast = useToast();

    const spawn = (model: Toast) => {
        toast(model);
    }

    return (
        <NotificationContext.Provider value={{ spawn }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};