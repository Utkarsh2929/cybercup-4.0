import numpy as np
import pandas as pd

# Simulate 1000 time-stamped events
np.random.seed(42)
timestamps = pd.date_range("2024-01-01", periods=1000, freq='H')
cpu_usage = np.random.normal(50, 10, size=1000)  # Average 50%, Std 10%
memory_usage = np.random.normal(60, 15, size=1000)  # Average 60%, Std 15%
network_in = np.random.normal(200, 50, size=1000)  # Average 200 KBps in
network_out = np.random.normal(180, 45, size=1000)  # Average 180 KBps out

# Create a DataFrame
data = pd.DataFrame({
    'timestamp': timestamps,
    'cpu_usage': cpu_usage,
    'memory_usage': memory_usage,
    'network_in': network_in,
    'network_out': network_out
})

data.to_csv('cloud_usage_data.csv', index=False)
print("Data generated and saved as cloud_usage_data.csv")
