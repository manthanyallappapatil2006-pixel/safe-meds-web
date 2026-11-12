import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * AdminRoute — protects routes that require admin role.
 * Redirects unauthenticated users to login and non-admins to home.
 */
export const AdminRoute = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
