import { useState, useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, Card, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import LearningService from '../services/learning.service';

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    LearningService.getQuizQuestions(1) // Demo hardcoded to quiz 1
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [quizId]);

  const handleAnswerChange = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    LearningService.submitQuiz(1, answers)
      .then(res => {
        setSubmitting(false);
        setResult(res.data); // QuizAttempt object
      })
      .catch(err => {
        console.error(err);
        setSubmitting(false);
      });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      <CircularProgress color="secondary" size={60} thickness={4} sx={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' }} />
    </Box>
  );

  if (questions.length === 0) return (
    <Box sx={{ p: 5, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" color="text.secondary">No questions found.</Typography>
    </Box>
  );

  if (result) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', p: 4 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: 600 }}>
          <Card sx={{ p: 5, width: '100%', textAlign: 'center', border: '1px solid rgba(185,102,254,0.3)', boxShadow: '0 20px 40px rgba(185,102,254,0.1)' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Your Score: <strong style={{ color: '#00e5ff', textShadow: '0 0 10px rgba(0,229,255,0.3)' }}>{result.score} / {result.totalQuestions}</strong>
            </Typography>
            <Button variant="contained" color="primary" size="large" onClick={() => navigate('/dashboard')} sx={{ borderRadius: '50px', px: 6 }}>
              Return to Dashboard
            </Button>
          </Card>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', p: 4 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: 800 }}>
        <Card sx={{ p: 5, width: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', mb: 1 }}>
            Java Quick Test
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>Answer all questions below to complete the test.</Typography>
          
          {questions.map((q, index) => (
            <Box key={q.id} sx={{ mb: 5, borderBottom: index < questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', pb: index < questions.length - 1 ? 4 : 0 }}>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 3 }}>
                {index + 1}. {q.questionText}
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup 
                  value={answers[q.id] || ''} 
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  {[
                    { val: 'A', text: q.optiona },
                    { val: 'B', text: q.optionb },
                    { val: 'C', text: q.optionc },
                    { val: 'D', text: q.optiond },
                  ].map((opt) => {
                    const isSelected = answers[q.id] === opt.val;
                    return (
                      <FormControlLabel
                        key={opt.val}
                        value={opt.val}
                        control={<Radio sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#00e5ff' } }} />}
                        label={opt.text}
                        sx={{
                          m: 0,
                          p: 2,
                          borderRadius: '16px',
                          border: isSelected ? '1.5px solid rgba(0,229,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          background: isSelected ? 'rgba(0,229,255,0.05)' : 'rgba(255,255,255,0.01)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: isSelected ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.04)',
                            borderColor: isSelected ? '#00e5ff' : 'rgba(255,255,255,0.2)',
                            transform: 'translateX(6px)'
                          }
                        }}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          
          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              onClick={handleSubmit} 
              disabled={submitting}
              sx={{ borderRadius: '50px', px: 5, fontWeight: 'bold' }}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
