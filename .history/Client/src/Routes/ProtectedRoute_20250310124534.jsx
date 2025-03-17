// ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  // For example, assume your auth slice stores user info in state.auth.user
  const { user } = useSelector((state) => state.auth);

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Otherwise, render the nested routes/components
  return <Outlet />;
};

export default ProtectedRoute;
