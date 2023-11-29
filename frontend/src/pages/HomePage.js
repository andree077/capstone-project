import React from 'react';
import TopBar from '../components/TopBar'; // Import TopBar component
import backgroundImg from 'D:/Projects/capstone-project/frontend/src/images/homepage.png'; // Replace with actual path

function HomePage() {
    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImg})` }}>
            <TopBar /> {/* Use the TopBar component */}

            {/* Content Section */}
            <div className="text-center p-10 text-white">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Speech Emotion Recognition Project</h1>
                <p className="mb-4">Brief overview of the project and objectives...</p>
            </div>
        </div>
    );
}

export default HomePage;
