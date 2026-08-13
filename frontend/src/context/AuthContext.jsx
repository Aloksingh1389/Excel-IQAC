import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getItem, setItem, STORAGE_KEYS, initializeLocalStorage } from '../services/localStorageHelper';
import { CURRENT_ACADEMIC_YEAR } from '../config/academicYears';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYearState] = useState(CURRENT_ACADEMIC_YEAR);

  useEffect(() => {
    initializeLocalStorage();
    const storedYear = getItem(STORAGE_KEYS.CURRENT_ACADEMIC_YEAR);
    if (storedYear) {
      setAcademicYearState(storedYear);
    }

    const loadSession = async () => {
      try {
        const res = await authService.getCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load session', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRole = async (roleKey, subType = null) => {
    setLoading(true);
    try {
      const res = await authService.switchUserByRole(roleKey, subType);
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) return;
    const res = await authService.updateProfile(user.id, updateData);
    setUser(res.data);
    return res.data;
  };

  const setAcademicYear = (year) => {
    setAcademicYearState(year);
    setItem(STORAGE_KEYS.CURRENT_ACADEMIC_YEAR, year);
  };

  const hasPermission = (permissionKey) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permissionKey);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    role: user?.role,
    subType: user?.subType,
    permissions: user?.permissions || [],
    academicYear,
    loading,
    login,
    logout,
    switchRole,
    updateProfile,
    setAcademicYear,
    hasPermission,
    hasRole,
    isAuthenticated: !!user,
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
