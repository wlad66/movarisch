import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [trial, setTrial] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('movarisch_token');
        // Return null instead of the string "null"
        return storedToken && storedToken !== 'null' ? storedToken : null;
    });

    useEffect(() => {
        // Al caricamento, valida il token tramite API
        if (token) {
            validateToken();
        } else {
            setLoading(false);
        }
    }, []);

    const validateToken = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setCompany(data.company);

                // Fetch subscription status and WAIT for it, passing the token explicitly
                await fetchSubscriptionStatus(token);
            } else {
                // Token non valido, pulisci
                logout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionStatus = useCallback(async (authToken = null) => {
        try {
            const tokenToUse = authToken || token;

            // Check if token is null, undefined, empty string, or the string "null"
            if (!tokenToUse || tokenToUse === 'null' || tokenToUse === 'undefined') {
                console.log('⚠️ No token available for subscription status, token value:', tokenToUse);
                return;
            }

            console.log('📡 Fetching subscription status with token:', tokenToUse.substring(0, 20) + '...');

            const response = await fetch('/api/subscription/status', {
                headers: { 'Authorization': `Bearer ${tokenToUse}` }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Subscription status fetched:', data.trial ? 'TRIAL ACTIVE' : 'NO TRIAL');
                setTrial(data.trial);
                setSubscription(data.subscription);
            } else {
                console.error('❌ Subscription status fetch failed:', response.status);
            }
        } catch (error) {
            console.error('Subscription status fetch error:', error);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error };
            }

            // Success
            setUser(data.user);
            setCompany(data.company);
            setToken(data.token);

            // Salva solo il token in localStorage
            localStorage.setItem('movarisch_token', data.token);

            // Fetch subscription status after login using the fresh token and WAIT
            await fetchSubscriptionStatus(data.token);

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Errore di connessione al server" };
        }
    };

    const register = async (userData, companyData, legalData) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    nome: userData.nome,
                    cognome: userData.cognome,
                    azienda: companyData.ragioneSociale,
                    piva: companyData.partitaIva,
                    companyData: companyData,
                    legalData: legalData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error };
            }

            // Auto-login
            setUser(data.user);
            setCompany(data.company);
            setToken(data.token);

            // Store trial data from registration response
            if (data.trial) {
                setTrial(data.trial);
            }

            // Salva solo il token in localStorage
            localStorage.setItem('movarisch_token', data.token);

            // Fetch full subscription status using the fresh token and WAIT
            await fetchSubscriptionStatus(data.token);

            return { success: true };
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, error: "Errore durante la registrazione" };
        }
    };

    const logout = () => {
        setUser(null);
        setCompany(null);
        setTrial(null);
        setSubscription(null);
        setToken(null);
        // Rimuovi solo il token
        localStorage.removeItem('movarisch_token');
    };

    const contextValue = useMemo(() => ({
        user,
        company,
        trial,
        subscription,
        login,
        register,
        logout,
        loading,
        token
    }), [user, company, trial, subscription, loading, token, login, register, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
