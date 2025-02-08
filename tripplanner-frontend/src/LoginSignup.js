// src/LoginSignup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:8081/auth/login' : 'http://localhost:8081/auth/register';
        axios.post(url, { username, password })
            .then(response => {
                if (isLogin) {
                    setToken(response.data.token);
                    navigate('/trip');
                } else {
                    alert('Registration successful. Please login.');
                    setIsLogin(true);
                }
            })
            .catch(error => {
                console.error('Error during authentication:', error);
                alert('Authentication error');
            });
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
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
