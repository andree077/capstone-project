import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars , faTimes} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Import the SideBar component
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [inputtedAudio, setInputtedAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState({ firstName: '' });

    let audioFiles = null;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex">
            <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            {/* Main content area */}
            <div className={`flex-1 p-10 transition-margin duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Dashboard Content */}
                <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
            </div>
        </div>
    );
}

export default Dashboard;
