import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchWatchlist();
    }
    setLoading(false);
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data.watchList || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { _id, name, email: userEmail, role, token } = response.data;
      const userData = { _id, name, email: userEmail, role };
      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchWatchlist();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post("/auth/register", { name, email, password });
      return login(email, password);
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const addToWatchlist = async (symbol) => {
    try {

      await api.post("/watchlist", { symbol });
      fetchWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {

      await api.delete(`/watchlist/${symbol}`);
      fetchWatchlist();
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, watchlist, addToWatchlist, removeFromWatchlist }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};