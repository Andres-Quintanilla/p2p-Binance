import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al iniciar sesión");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("esAdmin", data.esAdmin);
            setToken(data.token);
            setUsuario({
                email: data.email,
                esAdmin: data.esAdmin
            });

            return true;
        } catch(error){
            console.error("Login error: ", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUsuario(null);
        setToken("");
    };

    const estaAutenticado = () => !!token;
    const obtenerToken = () => token;

    useEffect(() => {
        const email = localStorage.getItem("email");
        const esAdmin = localStorage.getItem("esAdmin") === "true";

        if(email){
            setUsuario({
                email,
                esAdmin
            });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                estaAutenticado,
                obtenerToken,
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);