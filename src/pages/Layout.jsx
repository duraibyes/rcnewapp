import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './template/Navbar';
import { useSelector } from 'react-redux';

const Layout = () => {

    const isAuthenticated = useSelector(state => state.auth.user !== null);

    return (
        <>
        { isAuthenticated &&
            <Navbar />
        }
            <div className='h-auto px-3'>
                <Outlet />
            </div>
        </>
    );
}

export default Layout;