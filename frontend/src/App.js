import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages (sẽ thêm dần)
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserAgreement from "./pages/UserAgreement";
import PrivacyNotice from "./pages/PrivacyNotice";
import ProductListing from "./pages/listing/ProductListing";
import ProductDetail from "./pages/listing/ProductDetail";
import Checkout from "./pages/listing/Checkout";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-agreement" element={<UserAgreement />} />
          <Route path="/privacy-notice" element={<PrivacyNotice />} />
          <Route path="/listings" element={<ProductListing />} />
          <Route path="/listing/:id" element={<ProductDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
