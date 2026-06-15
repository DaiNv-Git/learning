import os

base_dir = "/Users/os_dainv/Desktop/project/TT-HO/Hoatt/smart-learning-platform/frontend/src"

files = {
    "theme.ts": """import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7E57C2' },
    secondary: { main: '#03DAC6' },
    background: { default: '#121212', paper: 'rgba(30,30,30,0.8)' },
  },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, backdropFilter: 'blur(10px)' } } },
  }
});
""",
    "App.tsx": """import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FlashcardStudy from './pages/FlashcardStudy';
import Quiz from './pages/Quiz';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study/:courseId" element={<FlashcardStudy />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
""",
    "pages/Login.tsx": """import { useState } from 'react';
import { Box, Card, TextField, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #121212 30%, #311b92 90%)' }}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, width: 400, textAlign: 'center', background: 'rgba(30, 30, 30, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Smart Learning</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>Welcome back! Please login.</Typography>
          <TextField fullWidth label="Username" margin="normal" variant="outlined" />
          <TextField fullWidth label="Password" type="password" margin="normal" variant="outlined" />
          <Button fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5 }} onClick={() => navigate('/dashboard')}>
            Login
          </Button>
        </Card>
      </motion.div>
    </Box>
  );
}
""",
    "pages/Dashboard.tsx": """import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [ { name: 'Mon', score: 20 }, { name: 'Tue', score: 40 }, { name: 'Wed', score: 80 }, { name: 'Thu', score: 60 } ];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: '#121212' }}>
      <Typography variant="h3" fontWeight="bold" mb={4} color="primary">My Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>Learning Progress</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}><XAxis dataKey="name" stroke="#888" /><YAxis stroke="#888" /><Tooltip /><Line type="monotone" dataKey="score" stroke="#03DAC6" strokeWidth={3} /></LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">Quick Actions</Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/study/1')}>Study Flashcards</Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/quiz/1')}>Take a Quiz</Button>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
""",
    "pages/FlashcardStudy.tsx": """import { useState } from 'react';
import { Box, Card, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function FlashcardStudy() {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#121212' }}>
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <IconButton onClick={() => navigate('/dashboard')} color="primary"><ArrowBackIcon /></IconButton>
      </Box>
      <Typography variant="h4" mb={4} color="text.secondary">Flashcard Study</Typography>
      
      <Box sx={{ perspective: 1000, width: 500, height: 300, cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <Card sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Typography variant="h3" fontWeight="bold" color="#fff">What is Dependency Injection?</Typography>
          </Card>
          {/* Back */}
          <Card sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="h4" color="#121212" sx={{ p: 3, textAlign: 'center' }}>A design pattern to decouple components by injecting dependencies externally.</Typography>
          </Card>
        </motion.div>
      </Box>
      
      <AnimatePresence>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 40, display: 'flex', gap: 16 }}>
            <Button variant="contained" color="error" size="large">Hard</Button>
            <Button variant="contained" color="warning" size="large">Good</Button>
            <Button variant="contained" color="success" size="large">Easy</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
""",
    "pages/Quiz.tsx": """import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', p: 4 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card sx={{ p: 5, maxWidth: 600, width: '100%' }}>
          <Typography variant="h4" mb={1} color="primary">Java Basics Quiz</Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>Time remaining: 14:59</Typography>
          
          <Typography variant="h6" mb={2}>1. Which component executes Java bytecodes?</Typography>
          <FormControl component="fieldset">
            <RadioGroup>
              <FormControlLabel value="A" control={<Radio color="secondary" />} label="JDK" />
              <FormControlLabel value="B" control={<Radio color="secondary" />} label="JRE" />
              <FormControlLabel value="C" control={<Radio color="secondary" />} label="JVM" />
              <FormControlLabel value="D" control={<Radio color="secondary" />} label="JIT" />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="primary">Previous</Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>Submit Quiz</Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Full frontend UI generated.")
