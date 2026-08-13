import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Verifying institutional session..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RoleRoute = ({ allowedRoles = [], requiredPermission = null }) => {
  const { role, hasPermission, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Authorizing permissions..." />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
