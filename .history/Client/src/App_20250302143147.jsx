import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
// import Dashboard from "./landing";
import Register from "./Authentication/Register";
import Dashboard from "./Farmer/Dashboard";
import Product from "./Farmer/Product";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
