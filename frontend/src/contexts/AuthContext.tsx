import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  grade_level: string;
  subjects: string[];
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  grade_level: string;
  subjects?: string[];
  preferences?: Record<string, any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { user } = await apiService.getCurrentUser();
      setUser(user);
    } catch (error) {
      // Token invalid, logout
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user, token: newToken } = await apiService.login({ email, password });

    setUser(user);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  };

  const register = async (userData: RegisterData) => {
    const { user, token: newToken } = await apiService.register(userData);

    setUser(user);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (updates: Partial<User>) => {
    const { user } = await apiService.updateProfile(updates);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};