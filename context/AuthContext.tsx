'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser, isLoggedIn } from '@/lib/auth';

interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on initial app load
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      const loggedIn = isLoggedIn();
      
      if (currentUser && loggedIn) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const result = await loginApi(email, password);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true, user: result.user };
    }
    
    return { success: false, message: result.message };
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    const result = await registerApi(name, email, password);
    
    if (result.success) {
      return { success: true, message: result.message };
    }
    
    return { success: false, message: result.message };
  };

  // Logout function
  const logout = () => {
    logoutApi();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is customer
  const isCustomer = () => {
    return user?.role === 'customer';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
