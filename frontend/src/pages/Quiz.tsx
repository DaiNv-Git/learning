import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import LearningService from '../services/learning.service';
import type { Question, Quiz as QuizMeta, QuizAttempt } from '../types';

const MotionBox = motion.create(Box);

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const numericQuizId = Number(quizId || 1);
  const [quiz, setQuiz] = useState<QuizMeta | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadQuiz() {
      try {
        setLoading(true);
        setError('');
        const [questionResponse, quizResponse] = await Promise.all([
          LearningService.getQuizQuestions(numericQuizId),
          LearningService.getQuizzes(),
        ]);
        if (!mounted) return;
        const quizInfo = quizResponse.data.find((item) => item.id === numericQuizId) ?? null;
        setQuiz(quizInfo);
        setQuestions(questionResponse.data);
        setAnswers({});
        setCurrentIndex(0);
        setResult(null);
        setSecondsLeft((quizInfo?.timeLimitMinutes || 15) * 60);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Không tải được bài kiểm tra. Vui lòng kiểm tra đăng nhập hoặc backend.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadQuiz();
    return () => {
      mounted = false;
    };
  }, [numericQuizId]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;
  const currentQuestion = questions[currentIndex];

  const submitQuiz = useCallback(
    async (autoSubmit = false) => {
      if (submitting || result || !questions.length) return;
      if (!autoSubmit && answeredCount < questions.length) {
        setWarning(`Bạn còn ${questions.length - answeredCount} câu chưa trả lời.`);
        return;
      }
      try {
        setWarning('');
        setSubmitting(true);
        const response = await LearningService.submitQuiz(numericQuizId, answers);
        setResult(response.data);
      } catch (err) {
        console.error(err);
        setError('Không nộp được bài kiểm tra. Vui lòng thử lại.');
      } finally {
        setSubmitting(false);
      }
    },
    [answeredCount, answers, numericQuizId, questions.length, result, submitting]
  );

  useEffect(() => {
    if (loading || result || submitting || !questions.length) return;
    if (secondsLeft <= 0) {
      submitQuiz(true);
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [loading, questions.length, result, secondsLeft, submitQuiz, submitting]);

  const handleAnswerChange = (questionId: number, option: string) => {
    setWarning('');
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setWarning('');
    setSecondsLeft((quiz?.timeLimitMinutes || 15) * 60);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress color="secondary" />
          <Typography color="text.secondary">Đang tải bài kiểm tra...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 560 }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>Về dashboard</Button>
        </Stack>
      </Box>
    );
  }

  if (!questions.length) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Bài kiểm tra chưa có câu hỏi</Typography>
          <Typography color="text.secondary">Admin có thể thêm câu hỏi cho quiz này trong dữ liệu hệ thống.</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>Về dashboard</Button>
        </Stack>
      </Box>
    );
  }

  if (result) {
    const percent = result.totalQuestions ? Math.round((result.score / result.totalQuestions) * 100) : 0;
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, md: 4 } }}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ width: '100%', maxWidth: 620 }}>
          <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 1, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 62, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 900 }}>Hoàn thành bài kiểm tra</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
              {quiz?.title || 'Bài kiểm tra'} đã được lưu vào lịch sử học tập.
            </Typography>
            <Box sx={{ p: 3, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'secondary.main' }}>{percent}%</Typography>
              <Typography color="text.secondary">
                Đúng {result.score}/{result.totalQuestions} câu
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
              <Button startIcon={<ReplayIcon />} variant="outlined" onClick={restartQuiz} sx={{ borderRadius: 1 }}>
                Làm lại
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')} sx={{ borderRadius: 1 }}>
                Về dashboard
              </Button>
            </Stack>
          </Card>
        </MotionBox>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 4 }, display: 'grid', placeItems: 'center' }}>
      <IconButton
        onClick={() => navigate('/dashboard')}
        sx={{
          position: 'fixed',
          top: { xs: 18, md: 28 },
          left: { xs: 18, md: 28 },
          color: 'text.primary',
          bgcolor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} sx={{ width: '100%', maxWidth: 860 }}>
        <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  {quiz?.title || 'Bài kiểm tra'}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  Câu {currentIndex + 1}/{questions.length} · Đã trả lời {answeredCount}/{questions.length}
                </Typography>
              </Box>
              <Chip
                icon={<TimerIcon />}
                label={formatTime(secondsLeft)}
                color={secondsLeft <= 60 ? 'error' : 'secondary'}
                sx={{ fontWeight: 800, minWidth: 112, justifyContent: 'center' }}
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.08)' }}
            />

            {warning && <Alert severity="warning">{warning}</Alert>}

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {questions.map((question, index) => (
                <Button
                  key={question.id}
                  size="small"
                  variant={index === currentIndex ? 'contained' : answers[question.id] ? 'outlined' : 'text'}
                  color={answers[question.id] ? 'secondary' : 'primary'}
                  onClick={() => setCurrentIndex(index)}
                  sx={{ minWidth: 42, borderRadius: 1 }}
                >
                  {index + 1}
                </Button>
              ))}
            </Stack>

            <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: 1, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.025)' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
                {currentIndex + 1}. {currentQuestion.questionText}
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(event) => handleAnswerChange(currentQuestion.id, event.target.value)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {[
                    { value: 'A', text: currentQuestion.optiona },
                    { value: 'B', text: currentQuestion.optionb },
                    { value: 'C', text: currentQuestion.optionc },
                    { value: 'D', text: currentQuestion.optiond },
                  ].map((option) => {
                    const selected = answers[currentQuestion.id] === option.value;
                    return (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio sx={{ color: 'rgba(255,255,255,0.36)', '&.Mui-checked': { color: 'secondary.main' } }} />}
                        label={`${option.value}. ${option.text}`}
                        sx={{
                          m: 0,
                          p: 1.5,
                          borderRadius: 1,
                          border: selected ? '1px solid rgba(34,211,238,0.72)' : '1px solid rgba(255,255,255,0.08)',
                          bgcolor: selected ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.02)',
                        }}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between' }}>
              <Button
                startIcon={<NavigateBeforeIcon />}
                variant="outlined"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                sx={{ borderRadius: 1 }}
              >
                Câu trước
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button
                  endIcon={<NavigateNextIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))}
                  sx={{ borderRadius: 1 }}
                >
                  Câu tiếp
                </Button>
              ) : (
                <Button variant="contained" color="secondary" disabled={submitting} onClick={() => submitQuiz(false)} sx={{ borderRadius: 1 }}>
                  {submitting ? 'Đang nộp...' : 'Nộp bài'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      </MotionBox>
    </Box>
  );
}
