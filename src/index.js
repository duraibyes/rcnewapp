import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home';
import Login from './pages/auth/Login';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './pages/Layout';
import Register from './pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />}/>
      <ProtectedRoute path='login' element={<Login />} />
      <ProtectedRoute path='register' element={<Register />} />
      <Route path='*' element={<div>Not Found</div>} />
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

reportWebVitals();
