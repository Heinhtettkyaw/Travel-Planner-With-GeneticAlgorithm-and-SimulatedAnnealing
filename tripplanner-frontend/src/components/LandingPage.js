// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        // Redirect to the login/signup page
        navigate('/login'); // Or wherever your LoginSignup.js is located
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-400 relative overflow-hidden">
            {/* Website Name in Top-Left Corner */}
            <div className="absolute top-6 left-6 z-10">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                    GeoQuery
                </h1>
                <p className="text-sm text-gray-200 font-semibold">Your fantastic trip planner</p>
            </div>

            {/* Live Photo Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Travel Background"
                    className="w-full h-full object-cover opacity-70 animate-livePhoto"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 bg-white p-10 rounded-lg shadow-2xl text-center max-w-md w-full">
                {/* Main Heading with Gradient and Animation */}
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 animate-fadeIn">
                    Plan Your Dream Trip
                </h1>

                {/* Subheading with Typewriter Effect */}
                <p className="text-lg mb-6 text-gray-600 font-medium relative overflow-hidden">
                    <span className="inline-block animate-typewriter whitespace-nowrap">
                        Get started now by logging in or signing up.
                    </span>
                </p>

                {/* Call-to-Action Button */}
                <button
                    onClick={handleGetStartedClick}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                    Let's Get Started
                </button>
            </div>
        </div>
    );
};

export default LandingPage;