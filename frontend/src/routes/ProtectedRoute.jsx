import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Authenticating session..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RoleRoute = ({ allowedRoles = ['INSTITUTION_ADMIN'] }) => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Checking authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.includes(role)
    : role === allowedRoles;

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const PermissionRoute = ({ requiredPermission }) => {
  const { hasPermission, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
