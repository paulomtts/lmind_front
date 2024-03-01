/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { useData } from './data/DataProvider';
import { useOverlay } from './OverlayProvider';
import Connector from './data/Connector';
import Toast, { useNotification } from './NotificationProvider';
import LoginPage from '../pages/Login/LoginPage';


const AuthContext = createContext();
const { Provider } = AuthContext;

export function AuthProvider({ children }) {

    const { spawn } = useNotification();
    const { show, hide } = useOverlay();
    const { customRoute } = useData();
    const url = Connector.addresses;
    
    const [inProcess, setInProcess] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    
    
    /* Effects */
    useEffect(() => {
        validate();
    }, []);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
    
        if(params.get('login') === 'false' && !isAuthenticated) {
            spawn(new Toast('Warning', 'Login failed', Toast.warning));
        }
    }, [isAuthenticated]);


    /* Methods */
    const validate = async () => {
        if (inProcess) return;

        setInProcess(true);
        const payload = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        }

        const { response } = await customRoute(url.auth.validate, payload, false, true);
        setIsAuthenticated(response.ok);
        setInProcess(false);
    }


    const login = async () => {
        if (inProcess) return;

        show();
        setInProcess(true);

        const { response, content } = await customRoute(
            url.auth.login
            , {method: 'GET', credentials: 'include'}
            , false
            , false
        );

        if (response.ok) window.location.href = content.url;

        hide(2000);
        setInProcess(false);
    }

    const logout = async () => {
        if (inProcess) return;

        show();
        setInProcess(true);

        const { response } = await customRoute(
            url.auth.logout
            , {method: 'GET', credentials: 'include'}
            , true
            , false
        );

        if (response.ok) {
            setIsAuthenticated(false);
        }

        hide(500);
        setInProcess(false);
    }

    const getUserInfo = async () => {
        const response = await fetch(url.custom.user, {method: 'GET', credentials: 'include'})
        const content = await response.json();
        const data = JSON.parse(content.data);

        if (response.ok) {
            setUser(data);
        }
    }

    return (
        <Provider value={{ isAuthenticated, login, logout, getUserInfo, user }}>
            {isAuthenticated ? children : <LoginPage />}
        </Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};