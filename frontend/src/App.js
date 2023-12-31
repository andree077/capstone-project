import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage'; // Assume these components exist
import ContactPage from './pages/ContactPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import EmployeeManagement from './pages/employeeManagement';
// import RegisterPage from './RegisterPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/call-analysis" element={<Analysis />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />

                {/* <Route path="/register" element={<RegisterPage />} /> */}
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
