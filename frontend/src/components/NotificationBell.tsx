import { useEffect, useState } from 'react';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Client } from '@stomp/stompjs';
import AuthService from '../services/auth.service';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) return;

    fetch('http://localhost:8080/api/notifications', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(console.error);

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      onConnect: () => {
        client.subscribe(`/user/${user.username}/queue/notifications`, (message) => {
          if (message.body) {
            const notif = JSON.parse(message.body);
            setNotifications(prev => [notif, ...prev]);
          }
        });
      },
    });

    client.activate();
    return () => { client.deactivate(); };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: number) => {
    if (!user) return;
    fetch(`http://localhost:8080/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick} sx={{ 
            color: 'text.secondary', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'primary.main', transform: 'translateY(-2px)' }
          }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { background: '#1e1e2d', color: 'white', width: 350, maxHeight: 400 } } }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem><ListItemText primary="No notifications" /></ListItem>
          ) : (
            notifications.map(n => (
              <ListItem key={n.id} sx={{ background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <ListItemText 
                  primary={n.message} 
                  secondary={
                    <Typography component="span" sx={{ color: 'gray', fontSize: '0.8rem' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  } 
                />
                {!n.isRead && (
                  <Button size="small" onClick={() => markAsRead(n.id)}>Mark Read</Button>
                )}
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
}
