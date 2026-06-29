import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, Button, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LearningService from '../services/learning.service';
import type { Announcement, DashboardStats } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    LearningService.getAnnouncements()
      .then((response) => setAnnouncements(response.data.slice(0, 3)))
      .catch((error) => console.error(error));

    LearningService.getDashboardStats()
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
      
    LearningService.getQuizzes()
      .then((response) => setAllQuizzes(response.data))
      .catch((error) => console.error(error));
      
    LearningService.getCourses()
      .then((response) => setAllCourses(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleRandomQuiz = () => {
    if (allQuizzes.length > 0) {
      const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
      navigate(`/quiz/${randomQuiz.id}`);
    } else {
      navigate('/courses');
    }
  };

  const handleRandomStudy = () => {
    if (allCourses.length > 0) {
      const randomCourse = allCourses[Math.floor(Math.random() * allCourses.length)];
      navigate(`/study/${randomCourse.id}`);
    } else {
      navigate('/courses');
    }
  };

  const chartData = stats?.recentAttempts
    ? [...stats.recentAttempts]
        .reverse()
        .slice(-5)
        .map(a => {
          const date = new Date(a.completedAt);
          return {
            name: `${date.getDate()}/${date.getMonth() + 1}`,
            score: Math.round((a.score / a.totalQuestions) * 100) || 0
          };
        })
    : [];

  const displayData = chartData.length > 0 ? chartData : [ { name: 'Chưa có', score: 0 } ];


  return (
    <DashboardLayout>
      <Box sx={{ mb: 5 }} component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          My Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Here is what is happening with your learning progress today.</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tiến độ học tập (Điểm Quiz)</Typography>
                  <Box sx={{ px: 2, py: 0.5, borderRadius: 2, background: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    Trung bình: {stats?.averageScore || 0}%
                  </Box>
                </Box>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={displayData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b966fe" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#b966fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(185,102,254,0.3)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                      itemStyle={{ color: '#00e5ff', fontWeight: 'bold' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#b966fe" strokeWidth={4} dot={{ r: 6, fill: '#070511', stroke: '#b966fe', strokeWidth: 3 }} activeDot={{ r: 8, fill: '#00e5ff', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            <Card sx={{ p: 3, borderRadius: 1 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <CampaignIcon color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Thông báo học tập</Typography>
                </Stack>
                {announcements.length ? announcements.map((item) => (
                  <Box key={item.id} sx={{ p: 2, borderRadius: 1, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.025)' }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 0.75, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>
                      <Chip size="small" label={item.audience} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{item.content}</Typography>
                  </Box>
                )) : (
                  <Typography color="text.secondary">Chưa có thông báo mới.</Typography>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ height: '100%' }}>
            <Card sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4 }}>Thao tác nhanh</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" color="primary" size="large" onClick={handleRandomStudy} startIcon={<AutoStoriesIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Học Flashcard (Ngẫu nhiên)
                </Button>
                <Button variant="contained" color="secondary" size="large" onClick={handleRandomQuiz} startIcon={<PlayArrowIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Làm bài Quiz (Ngẫu nhiên)
                </Button>
              </Box>
 
              <Box sx={{ mt: 'auto', p: 3, background: 'linear-gradient(135deg, rgba(185,102,254,0.1) 0%, rgba(0,229,255,0.1) 100%)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <LocalFireDepartmentIcon color="error" />
                  <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 'bold' }}>Thông số học tập</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Bạn đã học <strong style={{color: '#fff'}}>{stats?.studiedCards || 0} thẻ</strong>, trong đó có <strong style={{color: '#00e5ff'}}>{stats?.masteredCards || 0} thẻ</strong> đã thuộc nằm lòng!</Typography>
              </Box>
 
              <Box sx={{ mt: 'auto', p: 3, background: 'linear-gradient(135deg, rgba(185,102,254,0.1) 0%, rgba(0,229,255,0.1) 100%)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 'bold', mb: 1 }}>Current Streak 🔥</Typography>
                <Typography variant="body2" color="text.secondary">Keep it up! You have studied <strong style={{color: '#fff'}}>4 days</strong> in a row.</Typography>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
