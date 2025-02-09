import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Dashboard from "./Dashboard/Dashboard";
import Register from "./Authentication/Register";
// import Home from "./Home/home";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/dashboard" element={<Home />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
