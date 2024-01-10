/* Foreign dependencies */
import React, { ReactNode, useContext, createContext } from 'react';
import { useToast, Button } from '@chakra-ui/react'

import { ToastModel } from './models';

type NotificationContextType = {
    spawnToast: (model: any) => void;
    successModel: ToastModel;
    infoModel: ToastModel;
    warningModel: ToastModel;
    errorModel: ToastModel;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }) {
    
    const toast = useToast();
    const successModel = new ToastModel();
    const infoModel = new ToastModel('Info', 'Operation completed with one or more notes.', 'info');
    const warningModel = new ToastModel('Warning', '', 'warning');
    const errorModel = new ToastModel('Error', 'Operation failed.', 'error');

    const spawnToast = (model: any) => {
        toast({
            title: model.title,
            description: model.description,
            status: model.status,
            duration: model.duration,
            isClosable: model.isClosable,
        })
    }

    const values = {
        spawnToast,
        successModel,
        infoModel,
        warningModel,
        errorModel,
        ToastModel,
    }

    return (
        <NotificationContext.Provider value={values}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};