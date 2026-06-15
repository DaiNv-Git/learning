import { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import LearningService from '../services/learning.service';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [courses, setCourses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard'); // Protect route
      return;
    }
    loadCourses();
  }, [navigate]);

  const loadCourses = () => {
    LearningService.getCourses().then(res => setCourses(res.data));
  };

  const handleCreate = () => {
    LearningService.createCourse(newCourse).then(() => {
      setOpen(false);
      setNewCourse({ title: '', description: '' });
      loadCourses();
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      LearningService.deleteCourse(id).then(() => loadCourses());
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Admin Management
          </Typography>
          <Button variant="contained" color="secondary" size="large" onClick={() => setOpen(true)} sx={{ borderRadius: '50px', fontWeight: 'bold' }}>
            + Add New Course
          </Button>
        </Box>
        
        <TableContainer component={Card} sx={{ border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)', p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>ID</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Course Title</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Description</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textAlign: 'right', borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{course.id}</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{course.title}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{course.description}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <IconButton color="error" onClick={() => handleDelete(course.id)} sx={{ '&:hover': { background: 'rgba(244,67,54,0.1)' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Course Dialog */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          slotProps={{
            paper: {
              sx: { 
                background: 'rgba(20, 18, 30, 0.75)', 
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                color: 'white', 
                minWidth: { xs: '90%', sm: 450 },
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>Create New Course</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <TextField 
              fullWidth 
              label="Course Title" 
              margin="normal" 
              variant="outlined" 
              value={newCourse.title} 
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} 
            />
            <TextField 
              fullWidth 
              label="Description" 
              margin="normal" 
              variant="outlined" 
              multiline 
              rows={3} 
              value={newCourse.description} 
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} 
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ opacity: 0.7 }}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" color="secondary" sx={{ borderRadius: '50px', px: 4 }}>Create</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
