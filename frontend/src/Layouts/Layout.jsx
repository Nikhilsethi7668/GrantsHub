// Layout.js
import React from 'react';
import Navbar from '../Components/Navbar/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/Navbar/Navbar/Footer/Footer';

const Layout = () => {
    return (
        <>
            <Navbar />

            <Outlet />

            <Footer />
        </>
    );
};

export default Layout;
