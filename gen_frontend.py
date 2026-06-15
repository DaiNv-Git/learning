import os

base_dir = "/Users/os_dainv/Desktop/project/TT-HO/Hoatt/smart-learning-platform/frontend/src"

files = {
    "main.tsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#1976d2' } }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
""",
    "App.tsx": """import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function Home() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>Smart Learning Platform</Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Master your knowledge with Spaced Repetition Flashcards & Quizzes
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" size="large" href="/login">Login</Button>
        <Button variant="outlined" size="large" href="/courses">View Courses</Button>
      </Box>
    </Box>
  );
}

function Login() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">Login Page</Typography>
      <Typography variant="body1">Demo authentication form here...</Typography>
    </Box>
  );
}

function Courses() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">Courses List</Typography>
      <Typography variant="body1">List of courses fetched from backend API here...</Typography>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Frontend files generated successfully.")
