import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Dashboard from "./Farmer/Dashboard";
import Product from "./Farmer/Product";
import Order from "./Farmer/Order";
// import Message from "./pages/Message";
import Settings from "./Farmer/Settings";
import Landing from "./landing";
// import { useSelector } from "react-redux";

const App = () => {
  // function PrivateRoute({ children }) {
  //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  //   return isAuthenticated ? children : <Navigate to="/login" />;
  // }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              // <PrivateRoute>
              <Dashboard />
              // </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<Product />} />
          <Route path="/orders" element={<Order />} />
          {/* <Route path="/messages" element={<Message />} /> */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
