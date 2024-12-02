import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRoles is empty, any authenticated user can access
  if (requiredRoles.length === 0 || requiredRoles.includes(user.role)) {
    return children;
  }

  // Unauthorized
  return <Navigate to="/register" replace />;
};

export default PrivateRoute;