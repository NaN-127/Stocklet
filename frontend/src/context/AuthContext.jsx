import React, { useEffect, useEffectEvent, useState } from "react";
import api from "../services/api";
import AuthContext from "./authContext";

export const AuthProvider = ({ children }) => {
  const initialToken = typeof window === "undefined" ? null : localStorage.getItem("token");
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return initialToken;
  });
  const [watchlist, setWatchlist] = useState([]);

  async function refreshWatchlist() {
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data.watchList || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  const fetchWatchlistOnBoot = useEffectEvent(async () => {
    await refreshWatchlist();
  });

  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common["Authorization"];
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchWatchlistOnBoot();
  }, [token]);

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
      refreshWatchlist();
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
      refreshWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {

      await api.delete(`/watchlist/${symbol}`);
      refreshWatchlist();
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, watchlist, addToWatchlist, removeFromWatchlist }}>{children}</AuthContext.Provider>
  );
};
