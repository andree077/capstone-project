import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

function AboutUs() {
    return (
        <div className="flex flex-col min-h-screen">
           <TopBar />

            <div className="flex-grow container mx-auto flex flex-col items-center justify-center p-4">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
                    <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                    <p className="text-gray-700 text-base">
                        We are a dedicated call center committed to providing exceptional customer service and support to our clients.
                        Our team of experts is always ready to assist you with your inquiries and ensure your satisfaction.
                    </p>
                </div>
            </div>

            <footer className="bg-white p-4 text-center">
                <p>&copy; 2023 Speech Emotion Recognition</p>
            </footer>
        </div>
    );
}

export default AboutUs;
