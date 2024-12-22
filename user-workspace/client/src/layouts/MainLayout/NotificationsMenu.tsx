import React from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Button,
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Clear as ClearIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Notification, NotificationType } from '../../types/user';
import moment from 'moment';
import { styled } from '@mui/material/styles';

interface NotificationsMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const { user } = useAuth();
  const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <SuccessIcon color="success" />;
      case NotificationType.WARNING:
        return <WarningIcon color="warning" />;
      case NotificationType.ERROR:
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const handleClearNotification = (notificationId: string) => {
    // Here you would typically make an API call to clear the notification
    console.log('Clear notification:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    // Here you would typically make an API call to mark all notifications as read
    console.log('Mark all as read');
  };

  const renderNotification = (notification: Notification) => (
    <ListItem
      key={notification._id}
      sx={{
        opacity: notification.read ? 0.7 : 1,
        backgroundColor: notification.read ? 'transparent' : 'action.hover',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
      <ListItemText
        primary={notification.message}
        secondary={moment(notification.createdAt).fromNow()}
        primaryTypographyProps={{
          variant: 'body2',
          color: notification.read ? 'text.secondary' : 'text.primary',
        }}
      />
      <IconButton
        edge="end"
        size="small"
        onClick={() => handleClearNotification(notification._id)}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 480,
          overflow: 'hidden',
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        {unreadCount > 0 && (
          <Button size="small" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ maxHeight: 360, overflow: 'auto' }}>
        {user?.notifications && user.notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {user.notifications.map(renderNotification)}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No notifications
            </Typography>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 1 }}>
        <Button fullWidth onClick={onClose}>
          View All Notifications
        </Button>
      </Box>
    </Menu>
  );
};

export default NotificationsMenu;
