import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component

function TopBar() {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    {/* ... */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold">Home</Link>
                        <Link to="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">About Us</Link>
                        <Link to="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Contact Us</Link>
                    </div>
                    {/* Login / Register */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Login</Link>
                        <Link to="/register" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Register</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;
