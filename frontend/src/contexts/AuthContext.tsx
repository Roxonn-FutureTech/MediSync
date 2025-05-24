import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

interface User {
  id: number;
  email: string;
  username: string;
  roles: string[];
}

interface JWTPayload {
  user_id: number;
  email: string;
  roles: string[];
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, twoFactorToken?: string) => Promise<any>;
  logout: () => void;
  register: (email: string, username: string, password: string, role: string) => Promise<any>;
  enable2FA: () => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.user_id,
            email: decoded.email,
            username: decoded.email.split('@')[0],
            roles: decoded.roles
          });
          setIsAuthenticated(true);
        } else {
          refreshToken();
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, []);

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', new_refresh_token);

      const decoded = jwtDecode<JWTPayload>(access_token);
      setUser({
        id: decoded.user_id,
        email: decoded.email,
        username: decoded.email.split('@')[0],
        roles: decoded.roles
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, password: string, twoFactorToken?: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        two_factor_token: twoFactorToken
      });

      if (response.data.requires_2fa) {
        return { requires2FA: true };
      }

      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const decoded = jwtDecode<JWTPayload>(access_token);
      setUser({
        id: decoded.user_id,
        email: decoded.email,
        username: decoded.email.split('@')[0],
        roles: decoded.roles
      });
      setIsAuthenticated(true);

      return response.data;
    } catch (error: any) {
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

  const register = async (email: string, username: string, password: string, role: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        role
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

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    // This would need to be implemented based on your backend permission system
    // For now, we'll use a simple role-based check
    if (!user) return false;
    
    const rolePermissions: { [key: string]: string[] } = {
      'doctor': ['view_patients', 'edit_patients'],
      'nurse': ['view_patients'],
      'admin': ['admin_access'],
      'receptionist': ['view_appointments']
    };
    
    return user.roles.some(role => 
      rolePermissions[role]?.includes(permission)
    );
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
        resetPassword,
        hasRole,
        hasPermission,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 