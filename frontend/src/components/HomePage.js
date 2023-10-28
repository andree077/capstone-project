// src/components/Homepage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

function Homepage() {
  return (
    <div className="homepage">
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
        <section class="hero" id="home">
            <div class="hero-content">
                <div class="white-box">
                    <h2>Welcome to Speech Emotion Recognition</h2>
                    <p>Using Federated Learning for Quality Assurance in Call Centres</p>
                </div>
                <div class="button-container">
                    <a href="/about" class="hero-button">Learn More</a>
                 </div>
            </div>
        </section>

        
        <footer>
            <p>&copy; 2023 Speech Emotion Recognition</p>
        </footer>
    </div>
  );
  }

export default Homepage;
