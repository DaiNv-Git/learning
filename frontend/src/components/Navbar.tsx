import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import AuthService from '../services/auth.service';

export default function Navbar() {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ 
      background: 'rgba(255, 255, 255, 0.01)', 
      backdropFilter: 'blur(24px)', 
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      color: 'text.primary'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important', px: { xs: 2, md: 4 } }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {user?.username || 'Student'} <span style={{ display: 'inline-block', animation: 'wave 2s infinite', transformOrigin: '70% 70%' }}>👋</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <NotificationBell />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.03)', p: 1, pr: 2, borderRadius: 50, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', 
              boxShadow: '0 0 15px rgba(185,102,254,0.5)',
              fontWeight: 'bold'
            }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Button variant="text" color="error" size="small" onClick={handleLogout} sx={{ fontWeight: 'bold', minWidth: 'auto', p: 0, '&:hover': { background: 'transparent', textShadow: '0 0 8px rgba(244,67,54,0.5)' } }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
      <style>{`
        @keyframes wave {
          0% { transform: rotate( 0.0deg) }
          10% { transform: rotate(14.0deg) }  
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate( 0.0deg) }  
          100% { transform: rotate( 0.0deg) }
        }
      `}</style>
    </AppBar>
  );
}
