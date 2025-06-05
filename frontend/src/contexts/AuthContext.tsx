import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  loading: false,
  error: null,
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@medisync.com',
    password: 'password123',
    role: 'Administrator',
    avatar: '/avatar.jpg',
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    email: 'john.doe@medisync.com',
    password: 'password123',
    role: 'Doctor',
    avatar: '/avatar2.jpg',
  },
  {
    id: '3',
    name: 'Nurse Emma Wilson',
    email: 'emma.wilson@medisync.com',
    password: 'password123',
    role: 'Nurse',
    avatar: '/avatar3.jpg',
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials (mock implementation)
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (!foundUser) {
        setError('Invalid email or password');
        setLoading(false);
        return false;
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', 'mock-jwt-token'); // Mock token
      
      // Update state
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setLoading(false);
      
      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 