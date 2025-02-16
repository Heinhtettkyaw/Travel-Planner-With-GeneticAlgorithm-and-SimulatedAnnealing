import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * MainLayout component
 * Wraps protected pages and displays the Navbar at the top.
 */
const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navigation bar */}
            <Navbar />

            {/* Main content area */}
            <div className="flex-grow p-6">
                {/* Outlet renders the child route component */}
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;