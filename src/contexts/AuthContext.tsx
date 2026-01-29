import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'Fevrier2026*';
const AUTH_STORAGE_KEY = 'budget_auth';
const AUTH_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      try {
        const { expiryDate } = JSON.parse(authData);
        if (new Date().getTime() < expiryDate) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      const expiryDate = new Date().getTime() + AUTH_DURATION;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ expiryDate }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
