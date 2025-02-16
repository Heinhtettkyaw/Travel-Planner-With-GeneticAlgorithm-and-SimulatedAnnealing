// src/components/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * MainLayout component
 * Wraps protected pages and displays the Navbar at the top.
 */
const MainLayout = () => {
    return (
        <div>
            {/* Navigation bar */}
            <Navbar />
            {/* Main content area */}
            <div style={{ padding: '20px' }}>
                {/* Outlet renders the child route component */}
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
