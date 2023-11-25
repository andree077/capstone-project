import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Import the SideBar component
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Analysis() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [callsData, setCallsData] = useState([]);
    const [selectedCall, setSelectedCall] = useState('');
    const [chartInstances, setChartInstances] = useState({});
    const [aggregatedMetrics, setAggregatedMetrics] = useState(null);
    const [emotionDistribution, setEmotionDistribution] = useState({});
    const chartRefs = useRef({});
    const emotions = { 'happy': 1, 'angry': 2, 'confused': 3, 'neutral': 4 };

    let yourTestAnalysisData = [
        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'happy', speaker: 'SPEAKER 1' },
            { id: 1, start: 5.0, end: 6.0, text: "Hello, I'm speaking to Amma.", emotion: 'happy', speaker: 'SPEAKER 1' },
            { id: 2, start: 8.9, end: 10.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 1' },
            { id: 3, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' },
            { id: 4, start: 7.52, end: 9.66, text: 'This is Prithvi calling from...', emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 5, start: 10.52, end: 11.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' }
        ],
        // Call 2 Data
        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 1, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' }
        ],

        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'confused', speaker: 'SPEAKER 1' },
            { id: 1, start: 5.0, end: 6.0, text: "Hello, I'm speaking to Amma.", emotion: 'happy', speaker: 'SPEAKER 1' },
            { id: 2, start: 8.9, end: 10.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 1' },
            { id: 3, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' },
            { id: 4, start: 7.52, end: 9.66, text: 'This is Prithvi calling from...', emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 5, start: 10.52, end: 11.66, text: 'This is Prithvi calling from...', emotion: 'confused', speaker: 'SPEAKER 2' }
        ],
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // const handleFileChange = (e) => {
    //     setUploadedFiles([...e.target.files]);
    // };

    const handleFileChange = (e) => {
        setUploadedFiles([...e.target.files]);
    };

    const processAnalysisData = (data) => {
        return data.map(callSegments => {
            let speakerData = {};
            callSegments.forEach(segment => {
                const speakerKey = segment.speaker;
                if (!speakerData[speakerKey]) {
                    speakerData[speakerKey] = [];
                }
                speakerData[speakerKey].push({
                    time: segment.start,
                    emotion: segment.emotion
                });
            });
            return speakerData;
        });
    };

    const performAnalysis = async () => {
        setLoading(true);
        // Replace this with actual uploading logic
        setTimeout(() => {
            const processedData = processAnalysisData(yourTestAnalysisData);
            setCallsData(processedData);
            setAggregatedMetrics(calculateAggregatedMetrics(processedData));
            setLoading(false);
        }, 3000);
    };

    const emotionToValue = (emotion) => {
        const emotions = { 'happy': 1, 'angry': 2, 'confused': 3, 'neutral': 4 };
        return emotions[emotion] || 0;
    };

    const handleChangeCall = (e) => {
        setSelectedCall(e.target.value);
    };

    const createChart = (canvasId, data) => {
        const ctx = document.getElementById(canvasId).getContext('2d');

        if (chartRefs.current[canvasId]) {
            chartRefs.current[canvasId].destroy();
        }

        chartRefs.current[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => `${d.time}`),
                datasets: [{
                    label: 'Emotion Over Time',
                    data: data.map(d => emotionToValue(d.emotion)),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return Object.keys(emotions).find(key => emotions[key] === value);
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    useEffect(() => {
        if (selectedCall !== '' && callsData[selectedCall]) {
            Object.entries(callsData[selectedCall]).forEach(([speaker, data]) => {
                const canvasId = `canvas${selectedCall}_${speaker}`;
                createChart(canvasId, data);
            });
        }
    }, [selectedCall, callsData]);
    

    const calculateAggregatedMetrics = (data) => {
        let totalSatisfaction = 0;
        let emotionCounts = {};
        let totalDuration = 0;
        let duration = 0;
        let callCount = data.length;

        data.forEach(call => {
            Object.values(call).forEach(speaker => {
                speaker.forEach(segment => {
                    totalSatisfaction += emotionScore(segment.emotion);
                    emotionCounts[segment.emotion] = (emotionCounts[segment.emotion] || 0) + 1;
                });
            });
        });
        data.forEach(call => {
            Object.values(call).forEach(speaker => {
                let duration = 0;
                speaker.forEach(segment => {
                    if (duration < segment.end) {
                        duration = segment.end
                    }
                });
                totalDuration += duration;
            });
        });

        const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, "");
        const averageDuration = totalDuration / callCount;
        const overallSatisfaction = (totalSatisfaction - callCount * -3) / (callCount * 3 - callCount * -3) * 10;

        setEmotionDistribution(transformEmotionDataForChart(emotionCounts));

        return {
            overallCustomerSatisfaction: overallSatisfaction.toFixed(2),
            mostCommonEmotion: mostCommonEmotion,
            totalCallsProcessed: callCount,
            averageCallDuration: averageDuration.toFixed(2)
        };
    };

    const emotionScore = (emotion) => {
        const scores = { 'happy': 3, 'angry': -3, 'confused': -1, 'neutral': 1 };
        return scores[emotion] || 0;
    };

    const transformEmotionDataForChart = (emotionCounts) => {
        return {
            labels: Object.keys(emotionCounts),
            datasets: [{
                data: Object.values(emotionCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        };
    };

    

    return (
        <div className="container mx-auto p-4">
            <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 p-10 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <button onClick={toggleSidebar} className="text-white absolute top-0 right-0 mt-2 mr-2">
                    <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
                </button>

                <h1 className="text-2xl font-bold mb-4">Analysis Content</h1>
                <div>
                    <h2 className="text-xl mb-3">Audio Upload</h2>
                    <input type="file" multiple onChange={handleFileChange} className="mb-4" />
                    <button onClick={performAnalysis} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                        Upload and Analyze Audio
                    </button>
                </div>

            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
                    <div className="loader">Loading...</div>
                </div>
            )}

            {aggregatedMetrics && (
                <div className="my-4 p-4 bg-white rounded shadow-lg">
                    <h2 className="text-xl font-semibold mb-3">Aggregated Metrics Across All Calls</h2>
                    <table className="table-auto w-full mb-4">
                        <tbody>
                            <tr><td>Overall Customer Satisfaction Score:</td><td>{aggregatedMetrics.overallCustomerSatisfaction}</td></tr>
                            <tr><td>Most Commonly Predicted Emotion:</td><td>{aggregatedMetrics.mostCommonEmotion}</td></tr>
                            <tr><td>Total Calls Processed:</td><td>{aggregatedMetrics.totalCallsProcessed}</td></tr>
                            <tr><td>Average Call Duration:</td><td>{aggregatedMetrics.averageCallDuration} seconds</td></tr>
                        </tbody>
                    </table>
                    <div className="w-64 mx-auto">
                        <Pie data={emotionDistribution} />
                    </div>
                </div>
            )}

            <select onChange={handleChangeCall} className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="">Select a Call</option>
                {callsData.map((_, index) => (
                    <option key={index} value={index}>Call {index + 1}</option>
                ))}
            </select>

            {/* Graphs for Selected Call */}
            {selectedCall !== '' && Object.entries(callsData[selectedCall]).map(([speaker, data], index) => (
                <div key={index} className="graph-container my-6 p-4 bg-white rounded shadow-lg">
                    <h2 className="text-xl font-semibold mb-3">{speaker} - Call {parseInt(selectedCall) + 1}</h2>
                    <div className="graph w-full h-64">
                        <canvas id={`canvas${selectedCall}_${speaker}`}></canvas>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}

export default Analysis;
