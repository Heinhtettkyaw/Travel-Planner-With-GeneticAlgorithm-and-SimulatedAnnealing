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

        // Check if passwords match for registration
        if (!isLogin && password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Validate password for registration
        if (!isLogin && !validatePassword(password)) {
            setErrorMessage('Password must be at least 6 characters long, contain 1 capital letter and 1 number');
            return;
        }

        const url = isLogin ? 'http://localhost:8081/auth/login' : 'http://localhost:8081/auth/register';
        const requestData = isLogin
            ? { username, password }
            : { username, password, confirmPassword, email, phone, fullName, gender };

        // Log the request data to see what's being sent
        console.log("Request Data:", requestData);

        axios.post(url, requestData)
            .then(response => {
                if (isLogin) {
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    setToken(token);
                    navigate('/dashboard');
                } else {
                    alert('Registration successful. Please login.');
                    setIsLogin(true);
                }
            })
            .catch(error => {
                console.error('Error during authentication:', error);

                // Log the error response for debugging
                if (error.response) {
                    console.error('Backend Error:', error.response.data);
                    setErrorMessage(error.response.data.message || 'Authentication error');
                } else {
                    setErrorMessage('Network error or server unreachable');
                }
                alert('Authentication error');
            });
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* Show confirm password only if it's the sign-up page */}
                {!isLogin && (
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                {/* Show additional fields only if it's the sign-up page */}
                {!isLogin && (
                    <>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </>
                )}
                <div>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need to sign up?' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default LoginSignup;
