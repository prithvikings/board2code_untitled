import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      if (localStorage.getItem("tiki_guest_session")) {
        setUser({ _id: "guest", name: "Guest Player", role: "guest", isGuest: true, avatarSeed: "guest_default" });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    localStorage.removeItem("tiki_guest_session");
    try { await api.post('/auth/logout'); } catch(e) {}
    setUser(null);
  };

  const loginAsGuest = () => {
    localStorage.setItem("tiki_guest_session", "true");
    setUser({ _id: "guest", name: "Guest Player", role: "guest", isGuest: true, avatarSeed: "guest_default" });
  };

  const updateProfile = async (name, email, avatarSeed) => {
    const response = await api.patch('/auth/me/profile', { name, email, avatarSeed });
    setUser(response.data.user);
    return response.data;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.patch('/auth/me/password', { currentPassword, newPassword });
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, checkAuthStatus, updateProfile, updatePassword, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
