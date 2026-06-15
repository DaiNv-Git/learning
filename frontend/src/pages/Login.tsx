import { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthService from '../services/auth.service';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    AuthService.login(username, password)
      .then(() => {
        navigate('/dashboard');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data || 'Invalid username or password.');
      });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'transparent',
      px: 2
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%',
          maxWidth: 480, 
          textAlign: 'center', 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.1)', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glowing orb inside the card */}
          <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(185,102,254,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              Sign in to continue your learning journey
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)' }}>{error}</Alert>}
            
            <form onSubmit={handleLogin}>
              <TextField 
                fullWidth 
                label="Username" 
                margin="normal" 
                variant="outlined" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
              />
              <TextField 
                fullWidth 
                label="Password" 
                type={showPassword ? 'text' : 'password'} 
                margin="normal" 
                variant="outlined" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ mt: 5, py: 1.8 }} 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textShadow: '0 0 8px rgba(0,229,255,0.5)' } }}>
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
