import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/common/Navbar.js';
import Footer from './components/common/Footer.js';

// Pages
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import RestaurantList from './pages/RestaurantList.js';
import RestaurantMenu from './pages/RestaurantMenu.js';
import MyOrders from './pages/MyOrders.js';
import Cart from './pages/Cart.js';

// Context
import { CartProvider } from './context/CartContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext.js';
import { ToastProvider } from './context/ToastContext.js';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>  
          <Router>
            <div className="App d-flex flex-column min-vh-100">
              <Navbar />
              <div className="main-content flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;