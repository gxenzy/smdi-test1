const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const electricalSystemRoutes = require('./routes/electricalSystem');
const energyMonitoringRoutes = require('./routes/energyMonitoring');
const activityLogRoutes = require('./routes/activityLogs');
const energyMonitor = require('./services/energyMonitor');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/smdi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize energy monitoring service
energyMonitor.initialize()
  .then(() => console.log('Energy monitoring service initialized'))
  .catch(err => console.error('Error initializing energy monitoring service:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/electrical-system', electricalSystemRoutes);
app.use('/api/energy-monitoring', energyMonitoringRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      energyMonitoring: energyMonitor.monitoringInterval ? 'active' : 'inactive',
      websocket: {
        status: 'active',
        connectedClients: energyMonitor.getConnectedClientsCount()
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// WebSocket error handling
energyMonitor.wss?.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal');
  
  // Stop energy monitoring
  energyMonitor.stopMonitoring();
  
  // Close WebSocket server
  energyMonitor.wss?.close(() => {
    console.log('WebSocket server closed');
  });
  
  // Close MongoDB connection
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
  
  // Force exit if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
