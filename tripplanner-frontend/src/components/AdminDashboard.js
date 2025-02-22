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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar (Top) */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm transition duration-300"
                >
                    Logout
                </button>
            </nav>

            {/* Main Content Area */}
            <div className="flex flex-grow">
                {/* Left Sidebar */}
                <aside className="w-64 bg-gray-50 p-6 border-r border-gray-200">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="cities"
                                className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-md transition duration-300 hover:bg-gray-100 group"
                            >
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-gray-500 group-hover:text-gray-700 transition duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {/* Text */}
                                Manage Cities
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="places"
                                className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-md transition duration-300 hover:bg-gray-100 group"
                            >
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-gray-500 group-hover:text-gray-700 transition duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                {/* Text */}
                                Manage Places
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="users"
                                className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-md transition duration-300 hover:bg-gray-100 group"
                            >
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-gray-500 group-hover:text-gray-700 transition duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14s3-3 3-5-1-4-3-4-3 1-3 4 3 5 3 5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                                    />
                                </svg>
                                {/* Text */}
                                Manage Users
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="trips"
                                className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-md transition duration-300 hover:bg-gray-100 group"
                            >
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-gray-500 group-hover:text-gray-700 transition duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14l9-5-9-5-9 5 9 5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14l9-5-9-5-9 5 9 5z"
                                    />
                                </svg>
                                {/* Text */}
                                View Trips
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* Right Content Area */}
                <main className="flex-grow p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;