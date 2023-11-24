import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

function ContactUs() {
    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <div className="flex-grow container mx-auto flex flex-col items-center justify-center p-4">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                    <p className="text-gray-700 text-base">
                        If you have any questions or need assistance, please feel free to reach out to us:
                    </p>
                    <address className="not-italic mt-4">
                        <strong className="font-bold">Phone:</strong> (123) 456-7890
                        <br />
                        <strong className="font-bold">Email:</strong> <a href="mailto:info@callcenter.com" className="text-blue-500 hover:text-blue-700">info@callcenter.com</a>
                    </address>
                </div>
            </div>

            <footer className="bg-white p-4 text-center">
                <p>&copy; 2023 Speech Emotion Recognition</p>
            </footer>
        </div>
    );
}

export default ContactUs;
