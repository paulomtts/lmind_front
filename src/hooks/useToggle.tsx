import React from "react";

/**
 * Toggles a state between two values. If a list of values is provided, the 
 * state will be toggled between the values in the list. Please note that only 
 * a list of two values is supported. 
 * @param {string} initialStatus - The initial value of the state. (default: false)
 * @param {Array} valueList - The list of values to toggle between. (default: [] - toggle between true and false)
 */

interface ToggleOptions<T> {
    initialStatus?: T;
    valueList?: T[];
    callback?: () => void;
}

export function useToggle<T = boolean>({
    initialStatus = false as T,
    valueList = [] as T[],
    callback = () => {}
}: ToggleOptions<T> = {}): {
    status: T;
    toggleStatus: () => void;
} {
    const [status, setStatus] = React.useState<T>(initialStatus);

    React.useEffect(() => {
        callback();
    }, [status]);
    
    const toggleStatus = () => {
        if(valueList.length === 0){
            setStatus(prevState => !prevState as T);
        } else {
            setStatus(prevState => {
                const index = valueList.indexOf(prevState);
                if(index === -1){
                    return valueList[0];
                } else {
                    return valueList[(index + 1) % valueList.length];
                }
            });
        }
    }

    return { status, toggleStatus };
}