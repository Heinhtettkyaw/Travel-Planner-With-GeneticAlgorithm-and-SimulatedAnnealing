import React from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';


const AdminDashboard = () => {
    const navigate = useNavigate();

    // Handle logout: clear local storage and navigate to login
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };
    return (
        <div>

            <h2>Admin Dashboard</h2>
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Logout
            </button>
            <nav>
                <ul>
                    <li><Link to="cities">Manage Cities</Link></li>
                    <li><Link to="places">Manage Places</Link></li>

                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default AdminDashboard;
