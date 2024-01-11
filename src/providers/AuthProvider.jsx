/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { useData, url } from './DataProvider';
import { useOverlay } from './OverlayProvider';
import LoginPage from '../pages/Login/LoginPage';


const AuthContext = createContext();
const { Provider } = AuthContext;

export function AuthProvider({ children }) {

    const overlay = useOverlay();
    const api = useData();

    const [inProcess, setInProcess] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateSession = async () => {
            const payload = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }

            await fetch(url.auth.validate, payload)
            .then((response) => {
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                return response;
            })
            .catch(() => {});
        }


        try {
            overlay.show();
            validateSession();
        } catch (error) {
            console.log(error);
        } finally {
            overlay.hide();
        }
    }, []);


    const login = async () => {
        if (inProcess) return;

        overlay.show();
        setInProcess(true);

        const { response, content } = await api.customRoute(
            url.auth.login
            , {method: 'GET', credentials: 'include'}
            , true
            , false
        );

        if (response.ok) window.location.href = content.url;

        overlay.hide(2000);
        setInProcess(false);
    }


    const logout = async () => {
        if (inProcess) return;

        overlay.show();
        setInProcess(true);

        const { response } = await api.customRoute(
            url.auth.logout
            , {method: 'GET', credentials: 'include'}
            , true
            , false
        );

        if (response.ok) {
            setIsAuthenticated(false);
        }

        overlay.hide(500);
        setInProcess(false);
    }


    return (
        <Provider value={{ isAuthenticated, login, logout }}>
            {isAuthenticated ? children : <LoginPage />}
        </Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};