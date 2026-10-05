import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getMeApi, loginApi, registerApi, logoutApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    preferred_language?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agroai_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const currentToken = localStorage.getItem('agroai_token');
      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await getMeApi();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('agroai_token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('agroai_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('agroai_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    preferred_language?: string;
  }) => {
    const res = await registerApi(data);
    if (res.success && res.token) {
      localStorage.setItem('agroai_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('agroai_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
