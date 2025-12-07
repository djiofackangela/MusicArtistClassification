// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    email: localStorage.getItem("email") || null,
    role: localStorage.getItem("role") || null,
  });

  // whenever token changes, update axios default header
  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  const login = ({ token, email, role }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    setAuth({ token, email, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setAuth({ token: null, email: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
