import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LearningService from '../services/learning.service';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LearningService.getCourses()
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          Course Library
        </Typography>
        
        {loading ? (
          <Grid container spacing={4}>
            {[1,2,3].map(i => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 6, bgcolor: 'rgba(255,255,255,0.03)' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {courses.map((course, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': {
                      borderColor: idx % 2 === 0 ? 'rgba(185,102,254,0.3)' : 'rgba(0,229,255,0.3)',
                      boxShadow: idx % 2 === 0 
                        ? '0 12px 40px 0 rgba(185,102,254,0.15)' 
                        : '0 12px 40px 0 rgba(0,229,255,0.15)'
                    }
                  }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        background: idx % 2 === 0 
                          ? 'linear-gradient(135deg, #852ed0 0%, #b966fe 100%)' 
                          : 'linear-gradient(135deg, #00b1cb 0%, #00e5ff 100%)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(7,5,17,0.4) 100%)'
                        }
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography gutterBottom variant="h5" component="h2" color="text.primary" sx={{ fontWeight: 700 }}>
                        {course.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" sx={{ lineBreak: 'anywhere' }}>
                        {course.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        color={idx % 2 === 0 ? 'primary' : 'secondary'} 
                        fullWidth 
                        onClick={() => navigate(`/study/${course.id}`)}
                      >
                        Start Learning
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
