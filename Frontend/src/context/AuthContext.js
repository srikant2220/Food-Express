import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setAuthToken } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(''); // Clear previous errors
      const response = await authService.login(email, password);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      } else {
        // Handle API response that indicates failure but doesn't throw error
        const message = response.data.message || 'Login failed';
        setError(message);
        return { success: false, message };
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      let message = 'Login failed';
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        message = error.response.data?.message || 
                 error.response.data?.error ||
                 `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        message = 'Network error. Please check your connection.';
      } else {
        // Something else happened
        message = error.message || 'An unexpected error occurred';
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authService.register(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        message = error.response.data.errors.join(', ');
      } else if (error.message) {
        message = error.message;
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError(''); // Clear error on logout
  };

  const clearError = () => setError('');

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};