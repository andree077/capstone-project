import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Import the SideBar component
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import AnalysisDisplay from './AnalysisDisplay';
import callCenterAnimation from 'D:/Projects/capstone-project/frontend/src/images/callCentreAnimation.png';


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
    const [isDataAnalyzed, setIsDataAnalyzed] = useState(false);
    const [showUpload, setShowUpload] = useState(true);
    const chartRefs = useRef({});
    const emotions = { 'happy': 1, 'angry': 2, 'confused': 3, 'neutral': 4 };

    let yourTestAnalysisData = [
        // Call 1 Data
        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'confused', speaker: 'SPEAKER 1' },
            { id: 1, start: 5.0, end: 6.0, text: "Hello, I'm speaking to Amma.", emotion: 'happy', speaker: 'SPEAKER 1' },
            { id: 2, start: 8.9, end: 10.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 1' },
            { id: 3, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' },
            { id: 4, start: 7.52, end: 9.66, text: 'This is Prithvi calling from...', emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 5, start: 10.52, end: 11.66, text: 'This is Prithvi calling from...', emotion: 'confused', speaker: 'SPEAKER 2' }
        ],
        // Call 2 Data
        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 1, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' }
        ],
        // Call 3 Data
        [
            { id: 0, start: 0.0, end: 2.0, text: "Hello, I'm speaking to Amma.", emotion: 'confused', speaker: 'SPEAKER 1' },
            { id: 1, start: 5.0, end: 6.0, text: "Hello, I'm speaking to Amma.", emotion: 'happy', speaker: 'SPEAKER 1' },
            { id: 2, start: 8.9, end: 10.0, text: "Hello, I'm speaking to Amma.", emotion: 'angry', speaker: 'SPEAKER 1' },
            { id: 3, start: 4.52, end: 8.66, text: 'This is Prithvi calling from...', emotion: 'happy', speaker: 'SPEAKER 2' },
            { id: 4, start: 7.52, end: 9.66, text: 'This is Prithvi calling from...', emotion: 'angry', speaker: 'SPEAKER 2' },
            { id: 5, start: 10.52, end: 11.66, text: 'This is Prithvi calling from...', emotion: 'confused', speaker: 'SPEAKER 2' }
        ]
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
                    start: segment.start,
                    end: segment.end,
                    text: segment.text,
                    emotion: segment.emotion
                });
            });
            return speakerData;
        });
    };

    const performAnalysis = async () => {
        setLoading(true);
        setShowUpload(false); // Hide upload section
        const formData = new FormData();
        uploadedFiles.forEach(file => {
            formData.append('audioFiles', file);
        });

        try {
            const response = await axios.post('http://localhost:5000/upload-audio', formData);
        } catch (error) {
            console.error('Upload error:', error);
        }

        // try {
        //     const response = await axios.post('http://localhost:5000/upload-audio', formData);
        //     setCallsData(response.data); // Assuming the backend sends data in the desired format
        //     setIsDataAnalyzed(true);
        // } catch (error) {
        //     console.error('Upload error:', error);
        // } finally {
        //     setLoading(false);
        // }

        setTimeout(() => {
            const processedData = processAnalysisData(yourTestAnalysisData);
            setCallsData(processedData);
            const metrics = calculateAggregatedMetrics(processedData);
            setAggregatedMetrics(metrics);
            setSelectedCall('0');
            setLoading(false);
            setIsDataAnalyzed(true);
        }, 5000); // Simulate 5-second loading
    };

    const handleNewAnalysis = () => {
        setShowUpload(true);
        setIsDataAnalyzed(false);
        setAggregatedMetrics(null);
    };


    const emotionToValue = (emotion) => {
        const emotions = { 'happy': 1, 'angry': 2, 'confused': 3, 'neutral': 4 };
        return emotions[emotion] || 0;
    };

    const handleChangeCall = (e) => {
        setSelectedCall(e.target.value);
    };

    const createChart = (canvasId, data) => {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return; // Guard clause if canvas is not found

        // Destroy previous chart if exists
        if (chartRefs.current[canvasId]) {
            chartRefs.current[canvasId].destroy();
        }

        // Create new chart instance
        chartRefs.current[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => `${d.start}`),
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
            let callEndTimes = [];
            Object.values(call).forEach(speaker => {
                speaker.forEach(segment => {
                    callEndTimes.push(segment.end);
                    console.log("time:", segment['end']);
                });
            });
            totalDuration += Math.max(...callEndTimes);
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

    const calculateIndividualCallMetrics = (call) => {
        let maxEndTime = 0;
        let totalEmotionScore = 0;
        let segmentCount = 0;
    
        Object.values(call).forEach(speakerData => {
            speakerData.forEach(segment => {
                maxEndTime = Math.max(maxEndTime, segment.end || 0);
                totalEmotionScore += emotionScore(segment.emotion);
                segmentCount++;
            });
        });
    
        // Ensure segmentCount is not zero to avoid division by zero
        if (segmentCount === 0) {
            return { callDuration: '0', customerSatisfactionScore: '0' };
        }
    
        const customerSatisfactionScore = (totalEmotionScore - segmentCount * -3) / (segmentCount * 3 - segmentCount * -3) * 10;
        return {
            callDuration: maxEndTime.toFixed(2),
            customerSatisfactionScore: customerSatisfactionScore.toFixed(2)
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

    const handleAnalysisCompletion = () => {
        performAnalysis();
    };

    

    return (
        <div className="container mx-auto p-4">
            <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 p-10 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <button onClick={toggleSidebar} className="text-white absolute top-0 right-0 mt-2 mr-2">
                    <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
                </button>
                {showUpload && (
                <div>
                    <h2 className="text-xl mb-3">Audio Upload</h2>
                    <input type="file" multiple onChange={handleFileChange} className="mb-4" />
                    <button onClick={performAnalysis} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                        Upload and Analyze Audio
                    </button>
                </div>
            )}

            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
                    <img src={callCenterAnimation} alt="Call Center Loading Animation" className="w-1/4" style={{ maxWidth: '100px' }} />

                </div>
            )}
                {isDataAnalyzed && (
                <>
                    <h1 className="text-2xl font-bold mb-4">Analysis Content</h1>

                    <AnalysisDisplay
                        aggregatedMetrics={aggregatedMetrics}
                        emotionDistribution={emotionDistribution}
                        callsData={callsData}
                        selectedCall={selectedCall}
                        handleChangeCall={handleChangeCall}
                        calculateIndividualCallMetrics={calculateIndividualCallMetrics}
                    />
                    <button onClick={handleNewAnalysis} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Analyze Another Set of Calls
                    </button>
                </>
            )}
            </div>
        </div>
    );
}

export default Analysis;
