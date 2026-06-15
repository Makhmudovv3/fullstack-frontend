import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, fetchCart, fetchWishlist } from './redux/shopSlice';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Header1 from './pages/Header/Header1';
import Header2 from './pages/Header/Header2';
import Home from './pages/Home/Home';
import Footer from './pages/Footer/Footer';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import NotFound from './pages/Found/NotFound';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import Account from './pages/Account/Account';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import Wish from './components/Wish';
import Cart from './components/Cart';
import Checkout from './pages/Checkout/Checkout';
import Admin from './pages/Admin/Admin';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shop.user);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        theme="colored"
      />
      <ScrollToTop />
      {!isAdminRoute && (
        <>
          <Header1 />
          <Header2 onSearch={setSearch} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home searchValue={search} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wish />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;