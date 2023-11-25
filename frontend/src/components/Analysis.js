import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars , faTimes} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Import the SideBar component
import axios from 'axios';

function Analysis() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [inputtedAudio, setInputtedAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState({ firstName: '' });

    let audioFiles = null;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleEmployeeDataChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({
            ...employeeData,
            [name]: value,
        });
    };

    const handleAudioFileChange = (e) => {
        audioFiles = e.target.files;
        setInputtedAudio(audioFiles);
    };

    const sendAudioFilesToBackend = async () => {
        const formData = new FormData();
        for (const file of inputtedAudio) {
            formData.append('audioFiles', file);
        }

        try {
            const response = await axios.post('http://localhost:5000/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);

            if (response.status === 200) {
                console.log('Audio files uploaded successfully');
                return true;
            } else {
                console.error('Failed to upload audio files');
                return false;
            }
        } catch (error) {
            console.error('An error occurred while uploading audio files:', error);
            return false;
        }
    };

    const handleUploadAudio = async () => {
        setLoading(true);
        const success = await sendAudioFilesToBackend();

        if (success) {
            alert('Audio files uploaded and processed');
        } else {
            alert('Failed to upload audio files');
        }

        setLoading(false);
    };

    return (
        <div className="flex">
            <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <div className={`flex-1 p-10 transition-margin duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <button onClick={toggleSidebar} className="text-white absolute top-0 right-0 mt-2 mr-2">
                    <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
            </button>
                {/* Analysis Content */}
                <h1 className="text-2xl font-bold mb-4">Analysis Content</h1>
                <div>
                    <h2 className="text-xl mb-3">Audio Upload</h2>
                    <input
                        type="file"
                        name="audioFiles"
                        accept=".wav, .mp3"
                        multiple
                        onChange={handleAudioFileChange}
                        className="mb-3"
                    />
                    <button onClick={handleUploadAudio} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload Audio</button>
                </div>
                <div>
                    {/* Other Analysis functionalities */}
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
                    <div className="loader">Loading...</div>
                </div>
            )}

        </div>
    );
}

export default Analysis;
