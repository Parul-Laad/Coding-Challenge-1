import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, auth, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Check if the user is authenticated and has the correct role
  const isAuthenticated = token && userRole && userRole.includes(role);

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
