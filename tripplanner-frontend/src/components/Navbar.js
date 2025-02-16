import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Navbar component
 * Displays navigation links for Home (Dashboard), Profile, and a Logout button.
 */
const Navbar = () => {
    const navigate = useNavigate();

    // Handle logout: clear local storage and navigate to login
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <nav className="bg-gray-100 py-2 px-4 shadow-md flex items-center justify-between">
            {/* Left side: Navigation links */}
            <div className="flex space-x-4">
                <Link
                    to="/dashboard"
                    className="text-blue-500 hover:text-blue-600 font-medium transition duration-300"
                >
                    Dashboard
                </Link>
                <Link
                    to="/profile"
                    className="text-blue-500 hover:text-blue-600 font-medium transition duration-300"
                >
                    Profile
                </Link>
            </div>

            {/* Right side: Logout button */}
            <div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;