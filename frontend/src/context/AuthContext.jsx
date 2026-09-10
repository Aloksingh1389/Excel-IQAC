import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_ACADEMIC_YEAR } from '../data/mockAcademicYears';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYearState] = useState(() => {
    return storage.get(STORAGE_KEYS.ACADEMIC_YEAR, DEFAULT_ACADEMIC_YEAR);
  });
  const [theme, setThemeState] = useState(() => {
    return storage.get(STORAGE_KEYS.THEME, 'light');
  });

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.loginUser(email, password);
    if (response.success && response.user) {
      setUser(response.user);
      return response.user;
    }
    throw new Error('Authentication failed');
  };

  const logout = async () => {
    await authService.logoutUser();
    setUser(null);
  };

  const updateUser = async (updatedFields) => {
    if (!user) return;
    const response = await authService.updateUserProfile(user.id, updatedFields);
    if (response.success && response.user) {
      setUser(response.user);
      return response.user;
    }
  };

  const setAcademicYear = (newYear) => {
    setAcademicYearState(newYear);
    storage.set(STORAGE_KEYS.ACADEMIC_YEAR, newYear);
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    if (!requiredPermission) return true;
    const userPermissions = user.permissions || [];
    return userPermissions.includes(requiredPermission);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    designation: user?.designation || null,
    permissions: user?.permissions || [],
    loading,
    academicYear,
    setAcademicYear,
    theme,
    setTheme,
    login,
    logout,
    updateUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
