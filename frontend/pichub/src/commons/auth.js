import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userParam) => {
        setUser(userParam);
        localStorage.setItem("user", JSON.stringify(userParam)); // Store user in localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user"); // Remove user from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};