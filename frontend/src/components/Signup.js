// src/components/Signup.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './css/Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Add state for error message
  const history = useNavigate(); // Access the history object for routing

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password,
      });

      if (response.data.message) {
        // If a message is received, signup was successful
        history.push('/login'); // Route to the login page
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Set the error message
      }
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message if it exists */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
