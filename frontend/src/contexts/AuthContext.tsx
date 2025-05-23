import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string, twoFactorToken?: string) => Promise<any>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<any>;
  enable2FA: () => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, []);

  const login = async (email: string, password: string, twoFactorToken?: string) => {
    try {
      console.log('Login attempt:', { email, twoFactorToken: !!twoFactorToken });
      
      const response = await api.post('/auth/login', {
        email,
        password,
        two_factor_token: twoFactorToken
      });

      console.log('Login response:', response.data);

      if (response.data.requires_2fa) {
        return { requires2FA: true };
      }

      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const decoded = jwtDecode(access_token);
      setUser(decoded);
      setIsAuthenticated(true);

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const enable2FA = async () => {
    try {
      const response = await api.post('/auth/2fa/enable');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await api.post('/auth/password/reset/request', {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/password/reset/verify', {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        enable2FA,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 