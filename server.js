// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the templates directory
app.use(express.static(path.join(__dirname, 'templates')));

// Importing routes from the existing template files (ensure these files export router modules)
const memoryRoutes = require('./templates/memory');
const networkRoutes = require('./templates/network');
const notificationRoutes = require('./templates/notifications');
const scalingRoutes = require('./templates/scaling');
const reportsRoutes = require('./templates/reports');
const costRoutes = require('./templates/cost');
const cloudUsageRoutes = require('./templates/cloudUsage');
const cpuNetworkRoutes = require('./templates/cpuNetwork');
const cloudOverviewRoutes = require('./templates/cloudOverview');

// Setting up API routes
app.use('/api/memory', memoryRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/scaling', scalingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/cost', costRoutes);
app.use('/api/cloud-usage', cloudUsageRoutes);
app.use('/api/cpu-network', cpuNetworkRoutes);
app.use('/api/cloud-overview', cloudOverviewRoutes);

// Serve the HTML file as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
