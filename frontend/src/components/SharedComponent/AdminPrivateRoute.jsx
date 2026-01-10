import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  // Logged in but NOT ADMIN
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Logged in & ADMIN
  return <Outlet />;
};

export default AdminPrivateRoute;
