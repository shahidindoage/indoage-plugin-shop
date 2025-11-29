"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse cookies
    const cookies = document.cookie.split("; ").reduce((acc, curr) => {
      const [name, value] = curr.split("=");
      acc[name] = decodeURIComponent(value);
      return acc;
    }, {});

    if (cookies.user) {
      try {
        setUser(JSON.parse(cookies.user));
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }

    setLoading(false);
  }, []);

  const logout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
