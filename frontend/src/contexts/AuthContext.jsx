import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('nileshSeedsUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('nileshSeedsUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const response = await authAPI.login(username, password, role);

      if (response.data.success) {
        const userData = {
          userId: response.data.userId,
          role: response.data.role,
          name: response.data.name,
          username: response.data.username,
          phone: response.data.phone,
          village: response.data.village,
          address: response.data.address,
          profilePhotoUrl: response.data.profilePhotoUrl,
          ledgerLink: response.data.ledgerLink
        };
        
        setUser(userData);
        localStorage.setItem('nileshSeedsUser', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nileshSeedsUser');
  };

  const updateProfile = async (userId, updateData) => {
    try {
      const response = await userAPI.updateUser(userId, updateData);
      
      if (response.data.success) {
        const updatedUser = { ...user, ...updateData };
        setUser(updatedUser);
        localStorage.setItem('nileshSeedsUser', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await authAPI.checkUsername(username, user?.userId);
      return response.data.available;
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    checkUsernameAvailability,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
