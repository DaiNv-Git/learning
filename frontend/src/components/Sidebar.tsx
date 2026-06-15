import { Drawer, List, ListItemButton, ListItemIcon, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { motion } from 'framer-motion';

const drawerWidth = 280;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Courses', icon: <LibraryBooksIcon />, path: '/courses' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  ];

  if (isAdmin) {
    menuItems.push({ text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'rgba(7, 5, 17, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
        },
      }}
    >
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <SchoolIcon sx={{ color: 'primary.main', fontSize: 40, filter: 'drop-shadow(0 0 8px rgba(185,102,254,0.5))' }} />
        </motion.div>
        <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #b966fe, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Smart Learn
        </Typography>
      </Box>
      <List sx={{ mt: 2, px: 3 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  mb: 1.5, 
                  py: 1.5,
                  borderRadius: 3, 
                  position: 'relative',
                  overflow: 'hidden',
                  background: isActive ? 'linear-gradient(90deg, rgba(185,102,254,0.15) 0%, rgba(185,102,254,0.05) 100%)' : 'transparent',
                  color: isActive ? 'primary.light' : 'text.secondary',
                  transition: 'all 0.3s ease',
                  border: isActive ? '1px solid rgba(185,102,254,0.3)' : '1px solid transparent',
                  '&:hover': { 
                    background: isActive ? 'linear-gradient(90deg, rgba(185,102,254,0.2) 0%, rgba(185,102,254,0.05) 100%)' : 'rgba(255,255,255,0.05)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                {isActive && (
                  <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg, #b966fe, #00e5ff)', borderRadius: '4px 0 0 4px', boxShadow: '0 0 10px #b966fe' }} />
                )}
                <ListItemIcon sx={{ color: isActive ? 'primary.light' : 'text.secondary', minWidth: 40, zIndex: 1 }}>
                  {item.icon}
                </ListItemIcon>
                <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: '1.05rem', zIndex: 1 }}>
                  {item.text}
                </Typography>
              </ListItemButton>
            </motion.div>
          );
        })}
      </List>
    </Drawer>
  );
}
