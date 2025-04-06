import { useState, useEffect, useCallback } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Mock API functions for development
const mockLogin = async (email: string, password: string): Promise<AuthUser> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Demo user credentials
  const validCredentials = [
    {
      email: 'user@example.com',
      password: 'password',
      userData: {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        role: 'doctor'
      }
    },
    {
      email: 'admin@medisync.com',
      password: 'password',
      userData: {
        id: '2',
        name: 'Admin User',
        email: 'admin@medisync.com',
        role: 'admin'
      }
    },
    {
      email: 'doctor@medisync.com',
      password: 'password',
      userData: {
        id: '3',
        name: 'Dr. Sarah Smith',
        email: 'doctor@medisync.com',
        role: 'doctor'
      }
    },
    {
      email: 'nurse@medisync.com',
      password: 'password',
      userData: {
        id: '4',
        name: 'Nina Brown',
        email: 'nurse@medisync.com',
        role: 'nurse'
      }
    },
    {
      email: 'paramedic@medisync.com',
      password: 'password',
      userData: {
        id: '5',
        name: 'Paul Miller',
        email: 'paramedic@medisync.com',
        role: 'paramedic'
      }
    },
    {
      email: 'dispatcher@medisync.com',
      password: 'password',
      userData: {
        id: '6',
        name: 'Diana Garcia',
        email: 'dispatcher@medisync.com',
        role: 'dispatcher'
      }
    }
  ];
  
  // Find matching credentials
  const foundUser = validCredentials.find(
    user => user.email === email && user.password === password
  );
  
  if (foundUser) {
    return foundUser.userData;
  }
  
  throw new Error('Invalid credentials');
};

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // In a real app, validate token with API
        const userData = localStorage.getItem('medisync_user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear any invalid data
        localStorage.removeItem('medisync_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would call your API
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem('medisync_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
    localStorage.removeItem('medisync_user');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'doctor'
      };
      
      setUser(newUser);
      localStorage.setItem('medisync_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock password reset request
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, this would send a reset email
      console.log(`Password reset link sent to ${email}`);
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock password reset
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, this would verify the token and update the password
      console.log(`Password reset for token ${token}`);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated: !!user,
    loading,
    user,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword
  };
};

export default useAuth; 