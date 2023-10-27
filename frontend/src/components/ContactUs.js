// src/components/ContactUs.js

import React from 'react';
import { Link } from 'react-router-dom';

import './ContactUs.css';

function ContactUs() {
  return (
    <div className="contact">
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
      <div className='contact-us'>
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, please feel free to reach out to us:</p>
        <address>
          <strong>Phone:</strong> (123) 456-7890
          <br />
          <strong>Email:</strong> info@callcenter.com
        </address>
      </div>
    </div>
  );
}

export default ContactUs;
