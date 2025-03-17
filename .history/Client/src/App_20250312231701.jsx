import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
// Ensure that your user slice exports a synchronous action (here assumed as "login")
import { loginUser } from "./Redux/slice/userSlice";
import Login from "./Authentication/logIn";
import Register from "./Authentication/register";
import Dashboard from "./Farmer/Dashboard";
import Product from "./Farmer/Product";
import Order from "./Farmer/Order";
import Message from "./pages/Message";
import Settings from "./Farmer/Settings";
import Landing from "./landing";
import ProtectedRoute from "./Routes/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve token and user from localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Dispatch a synchronous action to load stored credentials into Redux state
        dispatch(loginUser({ token, user }));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/user-dashboard" element={<Landing />} />
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
