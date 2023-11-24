import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function SideBar({ isOpen, toggleSidebar }) {
    return (
        <div className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                <span className="text-xl font-semibold">Dashboard</span>
                <button onClick={toggleSidebar}>
                    {isOpen ? (
                        <FontAwesomeIcon icon={faTimes} className="h-6 w-6 text-white" size="lg" />
                    ) : (
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-white" size="lg" />
                    )}
                </button>
            </div>
            <nav className="flex flex-col p-4">
                <Link to="/dashboard" className="py-2 hover:bg-gray-700 rounded">Dashboard</Link>
                <Link to="/user-management" className="py-2 hover:bg-gray-700 rounded">User Management</Link>
                <Link to="/call-analysis" className="py-2 hover:bg-gray-700 rounded">Call Analysis</Link>
                <Link to="/employee-management" className="py-2 hover:bg-gray-700 rounded">Employee Management</Link>
                {/* Add more navigation links as needed */}
            </nav>
        </div>
    );
}

export default SideBar;
