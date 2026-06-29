import re

with open('frontend/src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace imports
imports = """import { useEffect, useState } from 'react';
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
import type { Announcement, DashboardStats } from '../types';"""
content = re.sub(r"import \{ useEffect.*?import type \{ Announcement \} from '\.\./types';", imports, content, flags=re.DOTALL)


# Remove hardcoded data block
content = re.sub(r"const data = \[.*?\];\n\n", "", content)

# Update states and hooks
hooks_block = """  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    LearningService.getAnnouncements()
      .then((response) => setAnnouncements(response.data.slice(0, 3)))
      .catch((error) => console.error(error));

    LearningService.getDashboardStats()
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
  }, []);

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
"""
content = re.sub(r"  const \[announcements, setAnnouncements\] = useState<Announcement\[\]>\(\[\]\);\n\n  useEffect\(\(\) => \{\n.*?  \}, \[\]\);", hooks_block, content, flags=re.DOTALL)


# Update LineChart and stats
chart_block = """                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                </ResponsiveContainer>"""
content = re.sub(r"                <Box sx=\{\{ display: 'flex', justifyContent: 'space-between'.*?</ResponsiveContainer>", chart_block, content, flags=re.DOTALL)


# Update quick actions stats
actions_block = """              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4 }}>Thao tác nhanh</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/courses')} startIcon={<AutoStoriesIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Học Flashcard
                </Button>
                <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/courses')} startIcon={<PlayArrowIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Làm bài Quiz
                </Button>
              </Box>
 
              <Box sx={{ mt: 'auto', p: 3, background: 'linear-gradient(135deg, rgba(185,102,254,0.1) 0%, rgba(0,229,255,0.1) 100%)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <LocalFireDepartmentIcon color="error" />
                  <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 'bold' }}>Thông số học tập</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Bạn đã học <strong style={{color: '#fff'}}>{stats?.studiedCards || 0} thẻ</strong>, trong đó có <strong style={{color: '#00e5ff'}}>{stats?.masteredCards || 0} thẻ</strong> đã thuộc nằm lòng!</Typography>
              </Box>"""
content = re.sub(r"              <Typography variant=\"h6\" sx=\{\{ fontWeight: 'bold', mb: 4 \}\}>Quick Actions</Typography>.*?              </Box>", actions_block, content, flags=re.DOTALL)


with open('frontend/src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
