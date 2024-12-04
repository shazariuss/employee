import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        username: decoded.username,
                        id: decoded.id,
                        role: decoded.role,
                    });
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser({
            username: decoded.username,
            id: decoded.id,
            role: decoded.role,
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
