import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useSelector } from 'react-redux';
import Category from './pages/master/category/Category';
import Product from './pages/master/product/Product';
import ProductForm from './pages/master/product/ProductForm';
import './App.css';

function App() {

  const isAuthenticated = useSelector(state => state.auth.user !== null);

  const handleProtectedRoute = (element) => {
    return !isAuthenticated ? <Navigate to="/login" replace /> : element;
  };

  const handlePublicRoute = (element) => {
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  };

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={handleProtectedRoute(<Home />)} />
        <Route path='category' element={handleProtectedRoute(<Category />)} />
        <Route path='product' element={handleProtectedRoute(<Product />)} />
        <Route path='product/form/:id?' element={handleProtectedRoute(<ProductForm />)} />
        <Route path='login' element={handlePublicRoute(<Login />)} />
        <Route path='register' element={handlePublicRoute(<Register />)} />
      </Route>
      <Route path='*' element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App; 