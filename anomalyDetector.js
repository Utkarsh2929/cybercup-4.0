import axios from 'axios';

// Function to fetch metrics from an API
export const fetchMetrics = async () => {
  try {
    // Update with the correct endpoint
    const response = await axios.get('http://localhost:5000/api/dashboard'); // Updated URL
    return response.data; 
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error; 
  }
};

// Simulated function to generate random metrics (for testing)
// ... (no changes required here)

// Function to detect anomalies based on fetched metrics
export const detectAnomaly = (data) => {
  const anomalies = [];
  
  if (data.memory > 80) {
    anomalies.push('High memory usage detected!');
  }
  if (data.network > 70) {
    anomalies.push('High network usage detected!');
  }
  Object.entries(data.cpu).forEach(([key, value]) => {
    if (value > 75) {
      anomalies.push(`High CPU usage on ${key} detected!`);
    }
  });

  return anomalies;
};

// Example test case (for quick testing, remove or comment out in production)
// ... (no changes required here)
