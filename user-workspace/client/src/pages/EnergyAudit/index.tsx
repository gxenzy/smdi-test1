import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  BatteryChargingFull as EnergyIcon,
  Lightbulb as LightbulbIcon,
  PowerSettingsNew as PowerIcon,
  Speed as MeterIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyData {
  timestamp: Date;
  consumption: number;
  voltage: number;
  current: number;
  powerFactor: number;
}

interface AuditItem {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'pending';
  value: number;
  recommendation?: string;
  compliance: 'compliant' | 'non-compliant' | 'partial';
  details: string;
  standard: string;
}

const EnergyAudit: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  // Simulate real-time energy data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: EnergyData = {
        timestamp: new Date(),
        consumption: Math.random() * 1000 + 500, // 500-1500W
        voltage: 220 + Math.random() * 10, // 220-230V
        current: Math.random() * 5 + 2, // 2-7A
        powerFactor: 0.8 + Math.random() * 0.2, // 0.8-1.0
      };
      setEnergyData(prev => [...prev.slice(-24), newData]); // Keep last 24 data points
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const startAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);

    // Simulate audit process
    const auditChecks: AuditItem[] = [
      {
        id: '1',
        name: 'Lighting Power Density',
        status: 'pending',
        value: 0,
        compliance: 'compliant',
        details: 'Checking lighting power density against PEC standards',
        standard: 'PEC 1 Section 4.2.1',
      },
      {
        id: '2',
        name: 'HVAC System Efficiency',
        status: 'pending',
        value: 0,
        compliance: 'compliant',
        details: 'Evaluating HVAC system performance and efficiency',
        standard: 'Energy Management Handbook Ch. 7',
      },
      {
        id: '3',
        name: 'Power Factor',
        status: 'pending',
        value: 0,
        compliance: 'compliant',
        details: 'Measuring power factor and harmonic distortion',
        standard: 'PEC 1 Section 3.5',
      },
    ];

    setAuditItems(auditChecks);

    for (let i = 0; i < auditChecks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = Math.random();
      const status = result > 0.7 ? 'passed' : result > 0.4 ? 'warning' : 'failed';
      const value = Math.random() * 100;
      
      setAuditItems(prev => 
        prev.map((item, index) => 
          index === i
            ? {
                ...item,
                status,
                value,
                compliance: status === 'passed' ? 'compliant' : status === 'warning' ? 'partial' : 'non-compliant',
                recommendation: status !== 'passed' ? 'Implement energy efficiency measures' : undefined,
              }
            : item
        )
      );
      
      setAuditProgress((i + 1) * (100 / auditChecks.length));
    }

    setIsAuditing(false);
  };

  const chartData = {
    labels: energyData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Energy Consumption (W)',
        data: energyData.map(d => d.consumption),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Energy Consumption',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Energy Audit</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={isAuditing ? null : <AssessmentIcon />}
            onClick={startAudit}
            disabled={isAuditing}
            sx={{ mr: 1 }}
          >
            {isAuditing ? 'Auditing...' : 'Start Audit'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            sx={{ mr: 1 }}
          >
            Save Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      {isAuditing && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Audit Progress
          </Typography>
          <LinearProgress variant="determinate" value={auditProgress} />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Real-time Monitoring */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Energy Monitoring
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Readings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Readings
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EnergyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Power Consumption"
                    secondary={`${energyData[energyData.length - 1]?.consumption.toFixed(2) || 0} W`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PowerIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Voltage"
                    secondary={`${energyData[energyData.length - 1]?.voltage.toFixed(1) || 0} V`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MeterIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Current"
                    secondary={`${energyData[energyData.length - 1]?.current.toFixed(2) || 0} A`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Power Factor"
                    secondary={`${energyData[energyData.length - 1]?.powerFactor.toFixed(2) || 0}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Audit Results */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Audit Results
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Check</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Standard</TableCell>
                      <TableCell>Recommendation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.name}
                            <Chip
                              label={item.compliance}
                              color={
                                item.compliance === 'compliant'
                                  ? 'success'
                                  : item.compliance === 'partial'
                                  ? 'warning'
                                  : 'error'
                              }
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.status === 'passed' && <CheckIcon color="success" />}
                            {item.status === 'warning' && <WarningIcon color="warning" />}
                            {item.status === 'failed' && <ErrorIcon color="error" />}
                            {item.status === 'pending' && <AssessmentIcon color="disabled" />}
                            {item.status}
                          </Box>
                        </TableCell>
                        <TableCell>{item.value.toFixed(2)}</TableCell>
                        <TableCell>{item.standard}</TableCell>
                        <TableCell>{item.recommendation || 'No action needed'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnergyAudit;
