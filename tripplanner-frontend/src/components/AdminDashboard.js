import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Handle logout: clear local storage and navigate to login
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Header Section */}
            <header className="w-full max-w-4xl mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm transition duration-300"
                >
                    Logout
                </button>
            </header>

            {/* Navigation Section */}
            <nav className="w-full max-w-4xl mb-8">
                <ul className="flex flex-col space-y-2">
                    <li>
                        <Link
                            to="cities"
                            className="block bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                        >
                            Manage Cities
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="places"
                            className="block bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                        >
                            Manage Places
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Outlet for nested routes */}
            <main className="w-full max-w-4xl flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;