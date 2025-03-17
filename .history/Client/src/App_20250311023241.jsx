import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./Redux/slice/authSlice";
import Login from "./Authentication/logIn";
import Register from "./Authentication/register";
import Dashboard from "./Farmer/Dashboard";
import Product from "./Farmer/Product";
import Order from "./Farmer/Order";
import Message from "./pages/Message";
import Settings from "./Farmer/Settings";
import Landing from "./landing";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { loginSuccess } from "./Redux/actions/authActions";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch({
        type: "LOGIN_SUCCESS", // <== no import needed, use type string or import your type
        payload: user,
      });
    }
  }, [dispatch]);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
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
      </div>
    </Router>
  );
};

export default App;
