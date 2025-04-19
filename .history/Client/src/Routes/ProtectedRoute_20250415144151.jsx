import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../Redux/slice/userSlice";

const ProtectedRoute = ({ children }) => {
  // const { isAuthenticated, userInfo } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // If not authenticated, check localStorage for credentials
  //   if (!isAuthenticated) {
  //     const token = localStorage.getItem("accessToken");
  //     const storedUser = localStorage.getItem("user");

  //     if (token && storedUser) {
  //       try {
  //         const parsedUser = JSON.parse(storedUser);
  //         console.log("Restoring auth from localStorage:", {
  //           token,
  //           user: parsedUser,
  //         });
  //         dispatch(login({ token, user: parsedUser }));
  //       } catch (error) {
  //         console.error("Error parsing stored user:", error);
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("user");
  //       }
  //     }
  //   }
  // }, [isAuthenticated, dispatch]);

  const { isAuthenticated, isAuthChecked, userInfo } = useSelector(
    (state) => state.user
  );

  // Wait until the persisted state has been rehydrated or checked
  if (!isAuthChecked) {
    return <div>Loading...</div>; // or a spinner component
  }

  // If not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Log authentication state for debugging
  console.log("Protected Route - Auth State:", isAuthenticated);
  console.log("Protected Route - User:", userInfo);

  // If not authenticated after checking localStorage, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Role-based access control
  const path = window.location.pathname;

  if (path.startsWith("/supplier") && userInfo?.role !== "Supplier") {
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
