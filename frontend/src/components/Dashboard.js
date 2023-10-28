import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

import './css/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [inputtedAudio, setInputtedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    // Initialize the state for employee data fields
    firstName: '',
    // Add more fields here
  });

  let audioFiles = null
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleEmployeeDataChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };


  const handleAudioFileChange = (e) => {
  const audioFiles = e.target.files;
  setInputtedAudio(audioFiles);
};

// Define a function to send audio files to the backend
const sendAudioFilesToBackend = async () => {
  const formData = new FormData();

  // Append each audio file to the FormData object
  for (const file of audioFiles) {
    formData.append('audio', file);
  }

  try {
    const response = await fetch('http://localhost:5000/upload-audio', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      alert('Audio files uploaded and processed successfully');
    } else {
      alert('Failed to upload audio files');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred');
  }
};



const handleUploadAudio = async () => {
  try {
    // Get the audio files from the state variable
    audioFiles = inputtedAudio;
    setLoading(true);

    if (audioFiles) {
      console.log(audioFiles);

      // Trigger the function to send audio files to the backend
      await sendAudioFilesToBackend(); // Assuming you have the sendAudioFilesToBackend function defined in your component

      alert('Audio files uploaded and processed');
    } else {
      alert('No audio files selected');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred');
  }
};

useEffect(() => {
  // Automatically hide the loading screen after 10 seconds (10000 milliseconds)
  if (loading) {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      clearTimeout(timeoutId);
      navigate('/analysis');
    }, 10000); // 10 seconds
  }
}, [loading]);



  return (
    <div>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <button onClick={() => handleTabChange('Dashboard')}>Dashboard</button>
        <button onClick={() => handleTabChange('Add Employee')}>Add Employee</button>
      </div>

      <div className="content">
        {activeTab === 'Dashboard' && (
          <div>
            <h1>Dashboard Content</h1>
            <h2>Audio Upload</h2>
            <input
              type="file"
              name="audio"
              accept=".wav, .mp3"
              multiple
              onChange={handleAudioFileChange}
            />
            <button onClick={handleUploadAudio}>Upload Audio</button>
          </div>
        )}
        {activeTab === 'Add Employee' && (
          <div>
            <h2>Add Employee</h2>
            <div className="input-container">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={employeeData.firstName}
                onChange={handleEmployeeDataChange}
              />
            </div>
            {/* Add more input fields for employee data */}
            <button type="submit">Submit</button>
          </div>
        )}
      </div>
      {loading && ( // Display loading screen when 'loading' is true
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
