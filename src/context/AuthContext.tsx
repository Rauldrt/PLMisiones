// This is a mock AuthContext. In a real application, you would integrate
// this with Firebase Authentication. For now, we use sessionStorage
// to simulate a logged-in state.

'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: boolean; // Simplified: true if logged in, false otherwise
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProviderComponent = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      setUser(isLoggedIn);
    } catch (error) {
      console.error("Could not access sessionStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = async (password: string): Promise<boolean> => {
    // In a real app, this would call Firebase Auth.
    // Here, we'll use a server action to check a secret password.
    const { checkPassword } = await import('@/lib/auth');
    const isValid = await checkPassword(password);
    
    if (isValid) {
      setUser(true);
      try {
        sessionStorage.setItem('isLoggedIn', 'true');
      } catch (error) {
        console.error("Could not access sessionStorage:", error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    // In a real app, this would call Firebase Auth's signOut.
    setUser(false);
    try {
      sessionStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error("Could not access sessionStorage:", error);
    }
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
