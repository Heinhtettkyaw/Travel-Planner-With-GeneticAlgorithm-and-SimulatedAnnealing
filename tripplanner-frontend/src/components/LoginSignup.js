import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Password validation regex
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (!isLogin && !validatePassword(password)) {
            setErrorMessage(
                'Password must be at least 6 characters long, contain 1 capital letter, and 1 number'
            );
            return;
        }

        const url = isLogin ? 'http://localhost:8081/auth/login' : 'http://localhost:8081/auth/register';
        const requestData = isLogin
            ? { username, password }
            : { username, password, confirmPassword, email, phone, fullName, gender };

        axios
            .post(url, requestData)
            .then((response) => {
                if (isLogin) {
                    const { token, role } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('role', role);
                    setToken(token);

                    // Redirect based on role
                    if (role === 'ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    alert('Registration successful. Please login.');
                    setIsLogin(true);
                }
            })
            .catch((error) => {
                if (error.response) {
                    setErrorMessage(error.response.data.message || 'Authentication error');
                } else {
                    setErrorMessage('Network error or server unreachable');
                }
                alert('Authentication error');
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-[1200px] w-full flex rounded-2xl shadow-2xl overflow-hidden mt-16 mb-16">
                {/* Left Column - Travel Image */}
                <div className="w-1/2">
                    <div className="relative h-[1000px]">
                        <img
                            src="./photos/travel_login.jpg"
                            alt="Travel Adventure"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        <div className="absolute inset-0 px-12 py-16 flex flex-col justify-center text-white">
                            <h1 className="text-5xl font-extrabold mb-4">
                                Explore the World
                            </h1>
                            <p className="text-2xl">
                                Your journey starts here
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="w-1/2 bg-white p-12">
                    <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8">
                        {isLogin ? 'Welcome to GeoQuery!' : 'Join the Adventure'}
                    </h2>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6">
                            <p className="text-red-700 font-medium">{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        {/* Confirm Password (Signup) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                            </div>
                        )}

                        {/* Additional Fields for Signup */}
                        {!isLogin && (
                            <>
                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition duration-200"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Toggle Button */}
                    <div className="mt-6 text-center text-blue-600 hover:underline font-medium">
                        <button onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Create an account' : 'Already have an account?'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;