import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthService from '../services/auth.service';

interface User {
  id: number;
  fullName: string;
  username: string;
}

interface Discussion {
  id: number;
  courseId: number;
  user: User;
  content: string;
  createdAt: string;
}

export default function CourseDiscussion({ courseId }: { courseId: string }) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newComment, setNewComment] = useState('');
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = () => {
    fetch(`http://localhost:8080/api/courses/${courseId}/discussions`, {
      headers: { Authorization: `Bearer ${currentUser?.token}` }
    })
      .then(res => res.json())
      .then(data => setDiscussions(data))
      .catch(console.error);
  };

  const handlePost = () => {
    if (!newComment.trim()) return;

    fetch(`http://localhost:8080/api/courses/${courseId}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`
      },
      body: JSON.stringify({ content: newComment })
    })
      .then(res => res.json())
      .then(newDisc => {
        setDiscussions([newDisc, ...discussions]);
        setNewComment('');
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8080/api/courses/admin/discussions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${currentUser?.token}` }
    })
      .then(res => {
        if (res.ok) {
          setDiscussions(discussions.filter(d => d.id !== id));
        }
      })
      .catch(console.error);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Q&A Discussions</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Ask a question or start a discussion..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <Button variant="contained" onClick={handlePost}>Post</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {discussions.map(disc => (
          <Paper key={disc.id} sx={{ p: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
            <Avatar sx={{ background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)' }}>
              {disc.user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {disc.user.fullName || disc.user.username} 
                  <span style={{ marginLeft: 8, color: 'gray', fontWeight: 'normal', fontSize: '0.8rem' }}>
                    {new Date(disc.createdAt).toLocaleString()}
                  </span>
                </Typography>
                {currentUser?.role === 'ADMIN' && (
                  <IconButton color="error" size="small" onClick={() => handleDelete(disc.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>{disc.content}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
