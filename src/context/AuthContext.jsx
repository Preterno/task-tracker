import React, { createContext, useContext, useState, useEffect } from "react";
import showToast from "../components/common/Toast";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    const adminEmail = import.meta.env.VITE_EMAIL;
    const adminPassword = import.meta.env.VITE_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const fakeToken = "demo-token";
      localStorage.setItem("token", fakeToken);
      setToken(fakeToken);
      setIsLoggedIn(true);
      showToast("Login successful", { type: "success" });
      navigate("/");
    } else {
      showToast("Invalid email or password", { type: "error" });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
    showToast("Logged out successfully", { type: "info" });
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      if (location.pathname === "/login") {
        const lastRoute = localStorage.getItem("lastRoute");
        navigate(lastRoute || "/");
      }
    } else {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/login") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
