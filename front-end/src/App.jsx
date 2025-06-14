import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Women from './components/ProductCategory/Women';
import Men from './components/ProductCategory/Men';
import Kids from './components/ProductCategory/Kids';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Login from './components/Login/Login';
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import Footer from './components/Footer/Footer';
import CreateProduct from './components/Admin/Create/CreateProduct';
import AdminPanel from "./components/Admin/AdminPanel/AdminPanel";
import EditProduct from "./components/Admin/EditProduct/EditProduct";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>

            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/women" element={<Women />} />
              <Route path="/men" element={<Men />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/product/:category/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/panel" element={<AdminPanel />} />
              <Route path="/admin/create" element={<CreateProduct />} />
              <Route path="/admin/edit/:id" element={<EditProduct />} />
            </Route>

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
