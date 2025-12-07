import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('movarisch_token'));

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

            // Salva solo il token in localStorage
            localStorage.setItem('movarisch_token', data.token);

            return { success: true };
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, error: "Errore durante la registrazione" };
        }
    };

    const logout = () => {
        setUser(null);
        setCompany(null);
        setToken(null);
        // Rimuovi solo il token
        localStorage.removeItem('movarisch_token');
    };

    return (
        <AuthContext.Provider value={{ user, company, login, register, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
