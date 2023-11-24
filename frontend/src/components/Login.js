import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
           <TopBar /> 

            <div className="flex-grow container mx-auto flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-xs">
                    <h2 className="text-2xl font-semibold mb-4">Login</h2>
                    {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</p>}
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
                        </div>
                    </form>
                    <p className="text-center text-gray-600 text-sm">
                        Don't have an account? <Link className="text-blue-500 hover:text-blue-700" to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>

            <footer className="bg-white p-4 text-center">
                <p>&copy; 2023 Speech Emotion Recognition</p>
            </footer>
        </div>
    );
}

export default Login;
