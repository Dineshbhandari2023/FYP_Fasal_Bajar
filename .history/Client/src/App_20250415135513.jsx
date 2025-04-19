// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./Redux/slice/userSlice";

import Login from "./Authentication/logIn";
import Register from "./Authentication/register";
import Dashboard from "./Farmer/Dashboard";
import Product from "./Farmer/Product";
import Order from "./Farmer/Order";
import Message from "./pages/Message";
import Settings from "./Farmer/Settings";
import Landing from "./pages/landing";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ProductList from "./Farmer/ProductList";
import UserDashboard from "./UI/UserDashboard";
import BrowsePage from "./browse/page";
import SellPage from "./sell/page";
import OrdersPage from "./orders/page";
import ProfilePage from "./profile/page";
import CartPage from "./cart/page";
import Map from "./map/page";
import Success from "./payment/success";
import Failure from "./payment/paymentFailure";
import PaymentComponent from "./payment/paymentForm";
import FarmerProfile from "./map/farmerProfile";
import MessagesPage from "./chat/messages";
//supplier imports
import SupplierDashboardPage from "./supplier/pages/DashboardPage";
import SupplierProfilePage from "./supplier/pages/ProfilePage";
// import SupplierMessagesPage from "./supplier/pages/MessagesPage";
import AnalyticsPage from "./supplier/Tabs/AnalyticsPage";
import DeliveriesPage from "./supplier/Tabs/DeliveriesPage";
import SupplierOrdersPage from "./supplier/Tabs/OrdersPage";
import SupplierMessagesPage from "./supplier/Tabs/MessagesPage";
import SupplierMapPage from "./supplier/Tabs/MapPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      dispatch(login({ token, user: JSON.parse(storedUser) }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/messages"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-list"
          element={
            <ProtectedRoute>
              <ProductList />
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
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Browse Routes */}
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/:id"
          element={
            <ProtectedRoute>
              <FarmerProfile />
            </ProtectedRoute>
          }
        />
        {/* Sell Routes */}
        {/* <Route path="/sell" element={<SellPage />} /> */}
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellPage />
            </ProtectedRoute>
          }
        />
        {/* Orders Routes */}
        {/* <Route path="/orders" element={<OrdersPage />} /> */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        {/* Profile Routes */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Cart Routes */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier/profile"
          element={
            <ProtectedRoute>
              <SupplierProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier/orders"
          element={
            <ProtectedRoute>
              <SupplierOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries"
          element={
            <ProtectedRoute>
              <DeliveriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/map"
          element={
            <ProtectedRoute>
              <SupplierMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/messages"
          element={
            <ProtectedRoute>
              <SupplierMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/settings"
          element={
            <ProtectedRoute>
              <SupplierDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/help"
          element={
            <ProtectedRoute>
              <SupplierDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />
        <Route path="/payment-form" element={<PaymentComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
