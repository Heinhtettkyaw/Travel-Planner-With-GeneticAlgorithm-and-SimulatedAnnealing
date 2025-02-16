// src/components/Navbar.js
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
        <nav style={{
            padding: '10px',
            backgroundColor: '#eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Left side: Navigation links */}
            <div>
                <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
                <Link to="/profile" style={{ marginRight: '15px' }}>Profile</Link>
            </div>
            {/* Right side: Logout button */}
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
