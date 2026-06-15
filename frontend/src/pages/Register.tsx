import { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthService from '../services/auth.service';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    AuthService.register(formData.username, formData.email, formData.password, formData.fullName, 'USER')
      .then(() => {
        setLoading(false);
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data || 'Failed to register account.');
      });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'transparent',
      px: 2,
      py: 4
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%', 
          maxWidth: 500, 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glowing orb inside the card */}
          <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, textAlign: 'center', background: 'linear-gradient(135deg, #00e5ff 0%, #b966fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', width: '100%' }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Join the future of smart learning today
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3, background: 'rgba(76, 175, 80, 0.1)', color: '#81c784', border: '1px solid rgba(76, 175, 80, 0.3)' }}>{success}</Alert>}
            
            <form onSubmit={handleRegister}>
              <TextField fullWidth label="Full Name" name="fullName" margin="normal" variant="outlined" value={formData.fullName} onChange={handleChange} />
              <TextField fullWidth label="Username" name="username" margin="normal" variant="outlined" value={formData.username} onChange={handleChange} />
              <TextField fullWidth label="Email Address" name="email" margin="normal" variant="outlined" type="email" value={formData.email} onChange={handleChange} />
              <TextField 
                fullWidth 
                label="Password" 
                name="password" 
                margin="normal" 
                variant="outlined" 
                type={showPassword ? 'text' : 'password'} 
                value={formData.password} 
                onChange={handleChange} 
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

              <Button type="submit" fullWidth variant="contained" color="secondary" size="large" sx={{ mt: 4, py: 1.8 }} disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: '#b966fe', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textShadow: '0 0 8px rgba(185,102,254,0.5)' } }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
