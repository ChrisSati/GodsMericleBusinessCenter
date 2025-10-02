// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for latest jwt-decode

export const AuthContext = createContext();

const API_URL = "http://127.0.0.1:8000/api";
const REFRESH_URL = `${API_URL}/token/refresh/`;
const LOGIN_URL = `${API_URL}/token/`;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh"));
  const [user, setUser] = useState(accessToken ? jwtDecode(accessToken) : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);

  // Set Axios Authorization header
  const setAxiosToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post(LOGIN_URL, { username, password });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUser(jwtDecode(response.data.access));
      setIsAuthenticated(true);
      setAxiosToken(response.data.access);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAxiosToken(null);
  };

  // Automatic token refresh
  useEffect(() => {
    setAxiosToken(accessToken);

    const interval = setInterval(async () => {
      if (!accessToken || !refreshToken) return;

      let decoded;
      try {
        decoded = jwtDecode(accessToken);
      } catch (e) {
        console.error("Invalid access token", e);
        logout();
        clearInterval(interval);
        return;
      }

      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      // Refresh 4 minutes before expiry
      if (timeLeft < 240) {
        try {
          const response = await axios.post(REFRESH_URL, { refresh: refreshToken });
          localStorage.setItem("access", response.data.access);
          setAccessToken(response.data.access);
          setUser(jwtDecode(response.data.access));
          setAxiosToken(response.data.access);
          console.log("Access token refreshed automatically");
        } catch (err) {
          console.error("Failed to refresh token", err);
          logout();
        }
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
