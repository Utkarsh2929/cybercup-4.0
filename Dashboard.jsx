import React, { useState, useEffect } from 'react';
import './proj.css'; // Ensure you have the styles in proj.css
import { fetchMetrics, detectAnomaly } from './anomalyDetector'; // Import your anomaly detection functions

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [anomalies, setAnomalies] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [loadingSpeed, setLoadingSpeed] = useState(false);

  // Function to fetch metrics data from the API
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.56.1:5000/metrics'); // Use the correct API endpoint
      const metricsData = await response.json();
      setData(metricsData);
      setLoading(false);
      
      // Detect anomalies based on the fetched metrics
      const detectedAnomalies = detectAnomaly(metricsData);
      setAnomalies(detectedAnomalies);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setLoading(false);
    }
  };

  // Fetch speed test results
  const testSpeed = async () => {
    setLoadingSpeed(true);
    try {
      const response = await fetch('http://192.168.56.1:5000/speed-test'); // Ensure this points to the correct endpoint
      const speedTestData = await response.json();
      setSpeedData(speedTestData);
    } catch (error) {
      console.error("Error fetching speed test:", error);
      setSpeedData(null);
    } finally {
      setLoadingSpeed(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Set up polling to fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Suspicious behavior detection logic
  useEffect(() => {
    let clickCount = 0;
    let keyPressCount = 0;
    const suspiciousThreshold = 5;

    const detectSuspiciousBehavior = () => {
      if (clickCount >= suspiciousThreshold || keyPressCount >= suspiciousThreshold) {
        setSuspiciousActivity(true);
        setPopupMessage('Suspicious activity detected! Monitoring...');
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      }
    };

    const handleUserClick = () => {
      clickCount++;
      detectSuspiciousBehavior();
    };

    const handleUserKeyPress = () => {
      keyPressCount++;
      detectSuspiciousBehavior();
    };

    window.addEventListener('click', handleUserClick);
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('click', handleUserClick);
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, []);

  useEffect(() => {
    if (suspiciousActivity) {
      console.log('Reporting suspicious activity to backend...');
      setTimeout(() => {
        setSuspiciousActivity(false);
        setPopupMessage('Suspicious activity resolved.');
      }, 5000);
    }
  }, [suspiciousActivity]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <div className="container">
      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      <header>
        <button className="voice-assistant">
          <img src="https://img.icons8.com/ios-glyphs/30/microphone.png" alt="Voice Assistant" />
        </button>
        <h1><b>AI-Based Cloud Infrastructure</b></h1>
      </header>

      <section className="dashboard">
        <div className="grid">
          {/* CPU Usage */}
          <div className="item small">
            <h2>CPU Usage</h2>
            <div className="circle">
              <span>{data.cpu_usage}%</span> {/* CPU usage data */}
            </div>
          </div>

          {/* RAM Usage */}
          <div className="item small">
            <h2>RAM Usage</h2>
            <div className="circle">
              <span>{data.ram_usage}%</span> {/* RAM usage data */}
            </div>
          </div>

          {/* Network Speed */}
          <div className="item small">
            <h2><u>Network Speed</u></h2>
            <div className="card">
              {speedData ? (
                <>
                  <p><b>Upload Speed: {speedData.upload_speed.toFixed(2)} Mbps</b></p>
                  <p><b>Download Speed: {speedData.download_speed.toFixed(2)} Mbps</b></p>
                  <p><b>Ping: {speedData.ping.toFixed(2)} ms</b></p>
                </>
              ) : (
                <p>No speed data available.</p>
              )}
              <button onClick={testSpeed} disabled={loadingSpeed}>
                {loadingSpeed ? 'Testing...' : 'Test Internet Speed'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
