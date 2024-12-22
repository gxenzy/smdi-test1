import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ElectricBolt as ElectricIcon,
  Assessment as AuditIcon,
  Build as ToolsIcon,
  Speed as TestingIcon,
  Poll as TamIcon,
  People as UsersIcon,
  Settings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: [] },
  {
    text: 'Electrical System',
    icon: <ElectricIcon />,
    path: '/electrical-system',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    text: 'Energy Audit',
    icon: <AuditIcon />,
    path: '/energy-audit',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    text: 'System Tools',
    icon: <ToolsIcon />,
    path: '/system-tools',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.MODERATOR],
  },
  {
    text: 'Testing',
    icon: <TestingIcon />,
    path: '/testing',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    text: 'TAM Evaluation',
    icon: <TamIcon />,
    path: '/tam-evaluation',
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
  },
  {
    text: 'User Management',
    icon: <UsersIcon />,
    path: '/users',
    roles: [UserRole.ADMIN],
  },
  {
    text: 'Admin Settings',
    icon: <AdminIcon />,
    path: '/admin',
    roles: [UserRole.ADMIN],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isRouteAccessible = (roles: UserRole[]) => {
    if (!roles.length) return true;
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <Box sx={{ p: 2, height: '100%', color: 'white' }}>
      <Box sx={{ mb: 4, mt: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          SMDI
        </Typography>
        <Typography variant="subtitle2">Admin Panel</Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
      <List>
        {menuItems.map(
          (item) =>
            isRouteAccessible(item.roles) && (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: location.pathname === item.path
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            )
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
