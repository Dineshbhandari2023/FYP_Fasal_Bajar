import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Debug log to check authentication state and user role
  console.log("Protected Route - Auth State:", isAuthenticated);
  console.log("Protected Route - User:", user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If trying to access a route that requires a specific role
  const path = window.location.pathname;

  if (path.startsWith("/supplier") && user?.role !== "Supplier") {
    console.log("Access denied: User is not a Supplier");
    return <Navigate to="/" />;
  }

  if (path.startsWith("/farmer-dashboard") && user?.role !== "Farmer") {
    console.log("Access denied: User is not a Farmer");
    return <Navigate to="/" />;
  }

  if (path.startsWith("/user-dashboard") && user?.role !== "Buyer") {
    console.log("Access denied: User is not a Buyer");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
