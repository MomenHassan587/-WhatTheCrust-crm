import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { csrfFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => window.__AUTH_USER__ || null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const authRequestVersion = useRef(0);

    useEffect(() => {
        let isMounted = true;
        const requestVersion = authRequestVersion.current;

        csrfFetch('/api/auth/me')
            .then((response) => {
                if (isMounted && requestVersion === authRequestVersion.current) {
                    setUser(response.user || null);
                }
            })
            .catch(() => {
                if (isMounted && requestVersion === authRequestVersion.current) setUser(null);
            })
            .finally(() => {
                if (isMounted) setIsCheckingAuth(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const value = useMemo(() => ({
        user,
        isCheckingAuth,
        login: async (credentials) => {
            authRequestVersion.current += 1;
            const response = await csrfFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            flushSync(() => {
                setUser(response.user);
                setIsCheckingAuth(false);
            });
            return response.user;
        },
        register: async (details) => {
            authRequestVersion.current += 1;
            const response = await csrfFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(details),
            });
            flushSync(() => {
                setUser(response.user);
                setIsCheckingAuth(false);
            });
            return response.user;
        },
        logout: async () => {
            authRequestVersion.current += 1;
            await csrfFetch('/api/auth/logout', { method: 'POST' });
            flushSync(() => {
                setUser(null);
                setIsCheckingAuth(false);
            });
        },
    }), [user, isCheckingAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider.');
    return context;
}
