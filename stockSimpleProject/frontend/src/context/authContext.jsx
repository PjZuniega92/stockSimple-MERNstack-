import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        
        if (token && username) {
            setUser({ username });
        }
    }, []);

    const login = (username, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser({ username });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
