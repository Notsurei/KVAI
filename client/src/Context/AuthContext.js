import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const sendRequest = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/auth/checkauth', {
                withCredentials: true
            });
            setIsAuthenticated(res.data);
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    };

    useEffect(() => {
        sendRequest();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
