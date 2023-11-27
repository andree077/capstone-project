import React from 'react';
import { Pie } from 'react-chartjs-2';

const AnalysisDisplay = ({ aggregatedMetrics, emotionDistribution, callsData, selectedCall, handleChangeCall, calculateIndividualCallMetrics }) => {
    const selectedCallData = callsData[selectedCall];
    const individualMetrics = selectedCallData ? calculateIndividualCallMetrics(selectedCallData) : null;

    const formatTime = (time) => {
        return time !== undefined && !isNaN(time) ? time.toFixed(2) : '0.00';
    };

    return (
        <div>
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

            <select onChange={handleChangeCall} className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                {callsData.map((_, index) => (
                    <option key={index} value={index}>Call {index + 1}</option>
                ))}
            </select>

            {selectedCallData && (
                <div className="my-4 p-4 bg-white rounded shadow-lg">
                    <p className="text-lg font-semibold">Total Call Duration: <span className="font-normal">{individualMetrics.callDuration} seconds</span></p>
                    <p className="text-lg font-semibold">Customer Satisfaction Score: <span className="font-normal">{individualMetrics.customerSatisfactionScore}</span></p>
                </div>
            )}

            {/* Graphs for Selected Call */}
            {selectedCallData && Object.entries(selectedCallData).map(([speaker, data], index) => (
                <div key={index} className="my-6 p-4 bg-white rounded shadow-lg">
                    <div key={index} className="graph-container my-6 p-4 bg-white rounded shadow-lg">
                    <h2 className="text-xl font-semibold mb-3">{speaker} - Call {parseInt(selectedCall) + 1}</h2>
                    <div className="graph w-full h-64">
                        <canvas id={`canvas${selectedCall}_${speaker}`}></canvas>
                    </div>
                </div>
                    <div className="transcript mt-4">
                        <h3 className="text-lg font-semibold mb-2">Transcript for {speaker}</h3>
                        <div className="transcript-content bg-gray-100 p-4 rounded hover:bg-gray-200 transition duration-300">
                            {data.map((segment, idx) => {
                                console.log("Rendering segment: ", segment); // Debug log
                                return (
                                    <p key={idx} className="mb-2">
                                        <span className="font-bold">[{formatTime(segment.start)} - {formatTime(segment.end)}]: </span>
                                        {segment.text || "No transcription available"}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnalysisDisplay;
