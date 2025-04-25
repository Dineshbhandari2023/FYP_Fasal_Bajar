import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../Redux/slice/userSlice";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthChecked, userInfo } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  // Wait until the persisted state has been rehydrated or checked
  if (!isAuthChecked) {
    return <div>Loading...</div>; // or a spinner component
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Log authentication state for debugging
  console.log("Protected Route - Auth State:", isAuthenticated);
  console.log("Protected Route - User:", userInfo);

  // Role-based access control
  const path = window.location.pathname;

  // Allow /supplier/:id for Buyers and Farmers
  const isSupplierProfileRoute = /^\/supplier\/\d+$/.test(path);
  const isRestrictedSupplierRoute =
    path.startsWith("/supplier") && !isSupplierProfileRoute;

  if (isRestrictedSupplierRoute && userInfo?.role !== "Supplier") {
    console.log("Access denied: User is not a Supplier");
    return <Navigate to="/" />;
  }

  if (
    (path.startsWith("/farmer-dashboard") || path.startsWith("/farmer-")) &&
    userInfo?.role !== "Farmer"
  ) {
    console.log("Access denied: User is not a Farmer");
    return <Navigate to="/" />;
  }

  if (path.startsWith("/user-dashboard") && userInfo?.role !== "Buyer") {
    console.log("Access denied: User is not a Buyer");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
