import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem('token');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  // 1. If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. Dashboard access check: only 'Company' users are allowed
  if (location.pathname === '/dashboard' && user?.type !== 'Company') {
    return <Navigate to="/jobs" replace />;
  }

  // 3. User is authorized
  return children;
}
