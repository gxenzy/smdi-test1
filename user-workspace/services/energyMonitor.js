const { EnergyReading, MonitoringDevice } = require('../models/EnergyMonitoring');
const WebSocket = require('ws');

class EnergyMonitorService {
  constructor() {
    this.devices = new Map();
    this.clients = new Set();
    this.monitoringInterval = null;
  }

  async initialize() {
    try {
      // Initialize WebSocket server
      this.wss = new WebSocket.Server({ port: 8080 });
      
      this.wss.on('connection', (ws) => {
        this.clients.add(ws);
        
        ws.on('close', () => {
          this.clients.delete(ws);
        });
      });

      // Load registered devices
      const devices = await MonitoringDevice.find({ status: 'active' });
      devices.forEach(device => {
        this.devices.set(device.deviceId, {
          ...device.toObject(),
          baseLoad: Math.random() * 500 + 200, // Random base load between 200-700W
          variation: Math.random() * 0.2 + 0.1, // Random variation 10-30%
        });
      });

      // Start monitoring
      this.startMonitoring();
    } catch (error) {
      console.error('Error initializing energy monitor service:', error);
    }
  }

  startMonitoring() {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(async () => {
      try {
        const readings = [];
        const timestamp = new Date();

        // Generate readings for each device
        for (const [deviceId, device] of this.devices) {
          const reading = this.generateReading(device, timestamp);
          readings.push(reading);

          // Save to database
          try {
            const energyReading = new EnergyReading(reading);
            await energyReading.save();
          } catch (error) {
            console.error(`Error saving reading for device ${deviceId}:`, error);
          }
        }

        // Broadcast readings to connected clients
        const message = JSON.stringify({
          type: 'readings',
          data: readings,
          timestamp
        });

        this.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });

      } catch (error) {
        console.error('Error in monitoring cycle:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  generateReading(device, timestamp) {
    // Generate realistic-looking energy consumption data
    const timeOfDay = timestamp.getHours();
    let loadFactor = 1;

    // Simulate daily load patterns
    if (timeOfDay >= 9 && timeOfDay <= 17) {
      // Peak hours (9 AM - 5 PM)
      loadFactor = 1.5;
    } else if (timeOfDay >= 23 || timeOfDay <= 5) {
      // Off-peak hours (11 PM - 5 AM)
      loadFactor = 0.5;
    }

    // Add some random variation
    const variation = (Math.random() * 2 - 1) * device.variation;
    const baseConsumption = device.baseLoad * loadFactor;
    const consumption = Math.max(0, baseConsumption * (1 + variation));

    // Generate correlated electrical parameters
    const voltage = 220 + (Math.random() * 10 - 5); // 220V ±5V
    const current = consumption / voltage;
    const powerFactor = 0.85 + Math.random() * 0.1; // 0.85-0.95

    return {
      deviceId: device.deviceId,
      timestamp,
      consumption,
      voltage,
      current,
      powerFactor,
      location: device.location
    };
  }

  async addDevice(deviceData) {
    try {
      const device = new MonitoringDevice(deviceData);
      await device.save();

      this.devices.set(device.deviceId, {
        ...device.toObject(),
        baseLoad: Math.random() * 500 + 200,
        variation: Math.random() * 0.2 + 0.1,
      });

      return device;
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }

  async updateDevice(deviceId, updates) {
    try {
      const device = await MonitoringDevice.findOneAndUpdate(
        { deviceId },
        updates,
        { new: true }
      );

      if (device) {
        if (device.status === 'active') {
          this.devices.set(device.deviceId, {
            ...device.toObject(),
            baseLoad: this.devices.get(deviceId)?.baseLoad || Math.random() * 500 + 200,
            variation: this.devices.get(deviceId)?.variation || Math.random() * 0.2 + 0.1,
          });
        } else {
          this.devices.delete(deviceId);
        }
      }

      return device;
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  async removeDevice(deviceId) {
    try {
      await MonitoringDevice.findOneAndDelete({ deviceId });
      this.devices.delete(deviceId);
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }

  getDeviceStatus(deviceId) {
    return this.devices.has(deviceId) ? 'active' : 'inactive';
  }

  getConnectedClientsCount() {
    return this.clients.size;
  }
}

// Create singleton instance
const energyMonitor = new EnergyMonitorService();

module.exports = energyMonitor;
