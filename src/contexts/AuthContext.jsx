import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import storageService from '../services/localStorage';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authData = storageService.getAuthData();
        
        if (authData.token && authData.user) {
          setUser(authData.user);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        storageService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.login(credentials);
      
      if (data.token && data.user) {
        storageService.setAuthData(data.token, data.user);
        setUser(data.user);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.register(userData);
      
      if (data.token && data.user) {
        storageService.setAuthData(data.token, data.user);
        setUser(data.user);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    authService.logout();
    storageService.clearAuthData();
    setUser(null);
  };
  
  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement API call to update profile when ready
      // const updatedUser = await userService.updateProfile(updateData);
      
      // For now, let's just update the local state
      const updatedUser = { ...user, ...updateData };
      storageService.setItem('user', updatedUser);
      setUser(updatedUser);
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;