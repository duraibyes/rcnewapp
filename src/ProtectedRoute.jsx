import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ProtectedRoute = ({ element, ...rest }) => {
    const isAuthenticated = !!cookies.get('TOKEN'); // Check if token exists
    console.log(isAuthenticated , ' isAuthenticated ');
    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/login" />}
        />
    );
};

export default ProtectedRoute;