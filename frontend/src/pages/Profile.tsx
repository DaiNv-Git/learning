import { useState, useEffect } from 'react';
import { Box, Typography, Card, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import LearningService from '../services/learning.service';
import authService from '../services/auth.service';

export default function Profile() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const user = authService.getCurrentUser();

  useEffect(() => {
    LearningService.getQuizAttempts()
      .then(res => setAttempts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          My Profile
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* User Info */}
          <Card sx={{ 
            p: 4, 
            minWidth: 320, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(185,102,254,0.15)',
            boxShadow: '0 8px 32px 0 rgba(185,102,254,0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '6px',
              background: 'linear-gradient(90deg, #b966fe 0%, #00e5ff 100%)'
            }
          }}>
            <Avatar sx={{ 
              width: 110, 
              height: 110, 
              mb: 3, 
              background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', 
              fontSize: 48,
              fontWeight: 800,
              color: '#070511',
              boxShadow: '0 0 20px rgba(0,229,255,0.4)'
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>{user?.fullName || 'Student User'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>@{user?.username}</Typography>
            <Chip 
              label={user?.role} 
              sx={{ 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                borderColor: 'primary.main', 
                color: 'primary.light', 
                px: 1,
                borderWidth: '1.5px',
                background: 'rgba(185,102,254,0.05)'
              }} 
              variant="outlined" 
            />
          </Card>

          {/* Quiz History */}
          <Card sx={{ 
            p: 4, 
            flexGrow: 1, 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
          }}>
            <Typography variant="h5" color="text.primary" sx={{ mb: 3, fontWeight: 800 }}>Quiz History</Typography>
            {attempts.length === 0 ? (
              <Typography color="text.secondary">No quizzes taken yet. Go to Courses to start!</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Quiz ID</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Score</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Result</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Date Taken</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attempts.map((attempt) => {
                      const percentage = (attempt.score / attempt.totalQuestions) * 100;
                      return (
                        <TableRow key={attempt.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ color: 'text.primary', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{attempt.quiz?.title || 'Java Quick Test'}</TableCell>
                          <TableCell sx={{ color: 'text.primary', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{attempt.score} / {attempt.totalQuestions}</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <Chip 
                              label={percentage >= 50 ? 'Passed' : 'Failed'} 
                              sx={{ 
                                fontWeight: 'bold', 
                                background: percentage >= 50 ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                                color: percentage >= 50 ? '#81c784' : '#e57373',
                                border: `1px solid ${percentage >= 50 ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)'}`
                              }} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Box>
      </motion.div>
    </DashboardLayout>
  );
}
