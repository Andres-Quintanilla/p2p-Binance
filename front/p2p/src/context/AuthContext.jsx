import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");
    const storedEsAdmin = localStorage.getItem("esAdmin") === "true";

    if (storedEmail && storedToken) {
      setUsuario({ email: storedEmail, esAdmin: storedEsAdmin });
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("esAdmin", data.esAdmin);
      setToken(data.token);
      setUsuario({ email: data.email, esAdmin: data.esAdmin });
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return true;
    } catch (error) {
      console.error("Login error: ", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUsuario(null);
    setToken(null);
  };

  const estaAutenticado = () => !!token;
  const obtenerToken = () => token;

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
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
