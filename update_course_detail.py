import re

with open('frontend/src/pages/CourseDetail.tsx', 'r') as f:
    content = f.read()

# 1. Add Quiz type to imports
imports = """import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Grid, Card, CardContent, CardActionArea, Stack, Chip } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DashboardLayout from '../layouts/DashboardLayout';
import CourseDiscussion from '../components/CourseDiscussion';
import AuthService from '../services/auth.service';
import LearningService from '../services/learning.service';
import type { Quiz } from '../types';"""
content = re.sub(r"import \{ useEffect.*?import AuthService from '\.\./services/auth\.service';", imports, content, flags=re.DOTALL)


# 2. Add quizzes state
hooks = """  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch course details and quizzes
    Promise.all([
      fetch('http://localhost:8080/api/courses', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => res.json()),
      LearningService.getQuizzes(Number(id)).then(res => res.data).catch(() => [])
    ])
      .then(([coursesData, quizzesData]) => {
        const found = coursesData.find((c: Course) => c.id === Number(id));
        setCourse(found || null);
        setQuizzes(quizzesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);"""

content = re.sub(r"  const \[course, setCourse\].*?  \}, \[id, navigate\]\);", hooks, content, flags=re.DOTALL)


# 3. Add quizzes UI above CourseDiscussion
ui = """              <Typography variant="body1" sx={{ color: 'text.secondary' }}>{course.description}</Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Bài kiểm tra (Quizzes)</Typography>
            {quizzes.length === 0 ? (
              <Typography color="text.secondary" sx={{ mb: 4 }}>Chưa có bài kiểm tra nào cho khóa học này.</Typography>
            ) : (
              <Grid container spacing={3} sx={{ mb: 6 }}>
                {quizzes.map((quiz) => (
                  <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                    <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <CardActionArea onClick={() => navigate(`/quiz/${quiz.id}`)}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <PlayCircleOutlineIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
                            <Chip label={`${quiz.timeLimitMinutes} phút`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                          </Stack>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{quiz.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{quiz.questionCount || 0} câu hỏi</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <CourseDiscussion courseId={id as string} />"""

content = re.sub(r"              <Typography variant=\"body1\" sx=\{\{ color: 'text\.secondary' \}\}>\{course\.description\}</Typography>\n            </Box>\n            \n            <CourseDiscussion courseId=\{id as string\} />", ui, content, flags=re.DOTALL)

# Because we used Grid item instead of Grid size (Grid v1 vs v2), I should replace Grid item with Grid size if v2 is used. 
# Wait, Grid v2 is used in this project! (Grid size={{ xs: 12 }}). Let me fix that.
content = content.replace("<Grid item xs={12} sm={6} md={4}", "<Grid size={{ xs: 12, sm: 6, md: 4 }}")

with open('frontend/src/pages/CourseDetail.tsx', 'w') as f:
    f.write(content)

