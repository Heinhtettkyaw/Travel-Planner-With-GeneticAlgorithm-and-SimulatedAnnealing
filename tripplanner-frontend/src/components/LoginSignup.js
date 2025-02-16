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

    // Validate password: at least 6 characters, 1 capital letter, and 1 number
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
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
            <div className="bg-white p-8 rounded-md shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Confirm Password Field (for Signup) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    )}

                    {/* Additional Fields for Signup */}
                    {!isLogin && (
                        <>
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Full Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name:</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Gender Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender:</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {/* Toggle Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? 'Need to sign up?' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;