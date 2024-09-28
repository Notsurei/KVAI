import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated) {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated]);

    if (isLoading) {
        return <span className="loading loading-spinner text-primary"></span>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}
