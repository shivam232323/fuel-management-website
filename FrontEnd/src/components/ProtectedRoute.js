import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Validate token expiration
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // If token is expired, remove it and redirect to login
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return <Navigate to="/login" replace />;
    }

    // Token is valid, render the protected component
    return children;
  } catch (error) {
    // If token is invalid or cannot be decoded, remove it and redirect
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
