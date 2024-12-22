import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  ElectricBolt as ElectricIcon,
  Assessment as AuditIcon,
  Speed as TestingIcon,
  Poll as TamIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  progress?: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  progress,
  onClick,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box>
          {icon}
          {onClick && (
            <IconButton
              size="small"
              onClick={onClick}
              sx={{ ml: 1 }}
            >
              <ArrowIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {progress !== undefined && (
        <>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="textSecondary">
            {progress}% Complete
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAccessElectrical = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  const canAccessAudit = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  const canAccessTesting = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  const canAccessTam = user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {canAccessElectrical && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Electrical System"
              value="85%"
              icon={<ElectricIcon color="primary" />}
              progress={85}
              onClick={() => navigate('/electrical-system')}
            />
          </Grid>
        )}

        {canAccessAudit && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Energy Audit"
              value="42"
              icon={<AuditIcon color="secondary" />}
              progress={65}
              onClick={() => navigate('/energy-audit')}
            />
          </Grid>
        )}

        {canAccessTesting && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="System Tests"
              value="12"
              icon={<TestingIcon color="info" />}
              progress={45}
              onClick={() => navigate('/testing')}
            />
          </Grid>
        )}

        {canAccessTam && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="TAM Evaluation"
              value="78%"
              icon={<TamIcon color="success" />}
              progress={78}
              onClick={() => navigate('/tam-evaluation')}
            />
          </Grid>
        )}
      </Grid>

      {/* Additional dashboard content can be added here */}
    </Box>
  );
};

export default Dashboard;
