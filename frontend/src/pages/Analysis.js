import React, { useState, useEffect } from 'react';

function Analysis() {
  const [emotionsData, setEmotionsData] = useState([]);

  // Mock emotions data for demonstration
  const mockEmotionsData = [
    { segment: 1, emotion: 'happy', speaker: 'customer' },
    { segment: 2, emotion: 'sad', speaker: 'customer' },
    { segment: 3, emotion: 'confused', speaker: 'agent' },
    { segment: 4, emotion: 'happy', speaker: 'agent' },
  ];

  useEffect(() => {
    // Replace this mock data with the data fetched from the backend
    setEmotionsData(mockEmotionsData);
  }, []);

  if (emotionsData.length === 0) {
    return <div>Loading...</div>;
  }

  // Separate data for customer and agent
  const customerData = emotionsData.filter((data) => data.speaker === 'customer');
  const agentData = emotionsData.filter((data) => data.speaker === 'agent');

  // Define emotion values
  const emotionValues = {
    happy: 3, // Value for happy emotion
    sad: -3, // Value for sad emotion
    confused: 0, // Value for confused emotion
  };

  // Extract emotions for plotting
  const customerEmotions = customerData.map((data) => emotionValues[data.emotion]);
  const agentEmotions = agentData.map((data) => emotionValues[data.emotion]);

  return (
    <div className="analysis-page">
      <h1>Analysis Page</h1>
      <div className="chart">
        <h2>Customer Emotions</h2>
        <div className="line-chart">
          {customerEmotions.map((value, index) => (
            <div
              className="point"
              key={index}
              style={{ left:` ${index * 50}px`, bottom:` ${value * 10}px `}}
            ></div>
          ))}
        </div>
      </div>
      <div className="chart">
        <h2>Agent Emotions</h2>
        <div className="line-chart">
          {agentEmotions.map((value, index) => (
            <div
              className="point"
              key={index}
              style={{ left: `${index * 50}px`, bottom: `${value * 10}px` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analysis;