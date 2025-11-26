import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('kidcode_token');
      const storedUser = await AsyncStorage.getItem('kidcode_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem('kidcode_token', newToken);
      await AsyncStorage.setItem('kidcode_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Błąd logowania' 
      };
    }
  };

  const register = async (email, password, role = 'student', adminKey = '') => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        role,
        adminKey 
      });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem('kidcode_token', newToken);
      await AsyncStorage.setItem('kidcode_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Błąd rejestracji' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('kidcode_token');
      await AsyncStorage.removeItem('kidcode_user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
