import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./App.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

//components
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Header from "./components/Header";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Checkout from "./components/Checkout";
import { fetchUserLocation } from "./reducers/locationSlice";
import Settings from './components/Settings';
import OrderHistory from "./components/OrderHistory";
import { AddressProvider } from './components/AddressContext';
import AdminOrders from "./components/AdminOrders";


function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserLocation());
  }, [dispatch]);

  return (
    <AddressProvider> {/* Wrap your entire application with AddressProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/allorders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AddressProvider>
  );
}

export default App;
