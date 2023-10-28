// src/components/AboutUs.js

import React from 'react';
import { Link } from 'react-router-dom';

import './css/AboutUs.css';

function AboutUs() {
  return (
    <div className="about">
        <header>
        <nav>
            <div class="logo">
                <h1>Speech Emotion Recognition</h1>
            </div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/login">Log In</Link></li>
            </ul>
        </nav>
        </header>
        <div className='about-us'>
          <h2>About Us</h2>
          <p>
            We are a dedicated call center committed to providing exceptional customer service and support to our clients.
            Our team of experts is always ready to assist you with your inquiries and ensure your satisfaction.
          </p>
        </div>
    </div>
  );
}

export default AboutUs;
