/* Foreign dependencies */
import React from 'react';


const FlowContext = React.createContext<any | null>(null);

export function FlowProvider({ children }) {

    const values = {
        a: 'def'
    };

    return (
        <FlowContext.Provider value={values}>
            {children}
        </FlowContext.Provider>
    );
}

export const useFlow = () => {
    const context = React.useContext(FlowContext);
    if (!context) {
        throw new Error('useFlow must be used within a FlowProvider');
    }
    return context;
};