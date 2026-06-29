import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import CourseDiscussion from '../components/CourseDiscussion';
import AuthService from '../services/auth.service';

interface Course {
  id: number;
  title: string;
  description: string;
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Assuming we fetch all and find, or if there's a specific endpoint
    fetch('http://localhost:8080/api/courses', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find((c: Course) => c.id === Number(id));
        setCourse(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Button onClick={() => navigate('/courses')} sx={{ mb: 2, color: 'gray' }}>
          &larr; Back to Courses
        </Button>
        {loading ? (
          <CircularProgress />
        ) : course ? (
          <>
            <Box sx={{ p: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>{course.title}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>{course.description}</Typography>
            </Box>
            
            <CourseDiscussion courseId={id as string} />
          </>
        ) : (
          <Typography variant="h5" color="error">Course not found</Typography>
        )}
      </Container>
    </DashboardLayout>
  );
}
