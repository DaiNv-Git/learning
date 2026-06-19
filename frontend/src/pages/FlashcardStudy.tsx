import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate, useParams } from 'react-router-dom';
import LearningService from '../services/learning.service';
import type { Deck, Flashcard } from '../types';

const MotionBox = motion.create(Box);

function difficultyLabel(level?: string) {
  if (level === 'EASY') return 'Dễ';
  if (level === 'HARD') return 'Khó';
  return 'Trung bình';
}

export default function FlashcardStudy() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isFlipAnimating, setIsFlipAnimating] = useState(false);
  const [isCardCompressed, setIsCardCompressed] = useState(false);
  const [actionsReady, setActionsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const flipTimers = useRef<number[]>([]);

  const clearFlipTimers = () => {
    flipTimers.current.forEach((timer) => window.clearTimeout(timer));
    flipTimers.current = [];
  };

  const resetFlipAnimation = () => {
    clearFlipTimers();
    setIsFlipAnimating(false);
    setIsCardCompressed(false);
    setActionsReady(false);
  };

  useEffect(() => () => clearFlipTimers(), []);

  useEffect(() => {
    let mounted = true;
    const id = Number(courseId || 1);

    async function load() {
      try {
        setLoading(true);
        setError('');
        const deckResponse = await LearningService.getDecks(id);
        if (!mounted) return;
        const availableDecks = deckResponse.data;
        setDecks(availableDecks);

        const deckId = availableDecks[0]?.id ?? id;
        setSelectedDeckId(deckId);
        const cardResponse = await LearningService.getFlashcards(deckId);
        if (!mounted) return;
        setFlashcards(cardResponse.data);
        setCurrentIndex(0);
        setFlipped(false);
        resetFlipAnimation();
        setFinished(false);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Không tải được bộ flashcard. Vui lòng kiểm tra backend hoặc đăng nhập lại.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!flipped) {
      setActionsReady(false);
      return;
    }
    const timer = window.setTimeout(() => setActionsReady(true), 220);
    return () => window.clearTimeout(timer);
  }, [flipped]);

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const currentDeck = useMemo(() => decks.find((deck) => deck.id === selectedDeckId), [decks, selectedDeckId]);

  const loadDeck = async (deckId: number) => {
    setSelectedDeckId(deckId);
    setLoading(true);
    setError('');
    try {
      const response = await LearningService.getFlashcards(deckId);
      setFlashcards(response.data);
      setCurrentIndex(0);
      setFlipped(false);
      resetFlipAnimation();
      setFinished(false);
    } catch (err) {
      console.error(err);
      setError('Không tải được flashcard của bộ này.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    if (submitting || finished || !currentCard || isFlipAnimating) return;
    const nextFlipped = !flipped;
    clearFlipTimers();
    setActionsReady(false);
    setIsFlipAnimating(true);
    setIsCardCompressed(true);
    flipTimers.current = [
      window.setTimeout(() => {
        setFlipped(nextFlipped);
        setIsCardCompressed(false);
      }, 170),
      window.setTimeout(() => {
        setIsFlipAnimating(false);
      }, 360),
    ];
  };

  const handleEvaluation = async (evaluation: 'HARD' | 'GOOD' | 'EASY') => {
    if (!currentCard || submitting) return;
    setSubmitting(true);
    try {
      await LearningService.submitFlashcardProgress(currentCard.id, evaluation);
      resetFlipAnimation();
      setFlipped(false);

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex((index) => index + 1);
      } else {
        setFinished(true);
      }
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError('Không lưu được tiến độ học. Vui lòng thử lại.');
    }
  };

  const restartDeck = () => {
    setCurrentIndex(0);
    setFlipped(false);
    resetFlipAnimation();
    setFinished(false);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress color="secondary" />
          <Typography color="text.secondary">Đang tải flashcard...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ maxWidth: 560, width: '100%' }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" onClick={() => navigate('/courses')}>
            Quay lại khóa học
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!flashcards.length) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <AutoStoriesIcon sx={{ fontSize: 54, color: 'text.secondary' }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Bộ thẻ này chưa có flashcard
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
            Vào trang quản trị để thêm thẻ học cho bộ này.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/courses')}>
            Chọn khóa học khác
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 2, md: 2.5 },
      }}
    >
      <IconButton
        onClick={() => navigate('/courses')}
        sx={{
          position: 'fixed',
          top: { xs: 18, md: 28 },
          left: { xs: 18, md: 28 },
          zIndex: 20,
          color: 'text.primary',
          bgcolor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: 920 }}>
        <Chip
          label={currentDeck?.title || 'Flashcard Study'}
          sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'text.secondary', borderRadius: 2 }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: 34, sm: 44, md: 56 },
            lineHeight: 1,
            color: 'text.primary',
          }}
        >
          Study Mode
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
          Card {currentIndex + 1} of {flashcards.length}
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 620 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { borderRadius: 999 },
            }}
          />
        </Box>
      </Stack>

      {decks.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ maxWidth: '100%', overflowX: 'auto', pb: 0.5 }}>
          {decks.map((deck) => (
            <Button
              key={deck.id}
              size="small"
              variant={selectedDeckId === deck.id ? 'contained' : 'outlined'}
              onClick={() => loadDeck(deck.id)}
              sx={{ whiteSpace: 'nowrap', borderRadius: 999 }}
            >
              {deck.title}
            </Button>
          ))}
        </Stack>
      )}

      <Box
        sx={{
          width: 'min(92vw, 780px)',
          height: { xs: 'min(44vh, 330px)', sm: 'min(46vh, 370px)', md: 'min(48vh, 400px)' },
          perspective: '1400px',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {!finished ? (
            <MotionBox
              key={currentCard.id}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              sx={{ width: '100%', height: '100%', position: 'absolute' }}
            >
              <Box
                data-testid="flashcard-flip"
                role="button"
                tabIndex={0}
                aria-label={flipped ? 'Mặt sau flashcard, bấm để quay lại mặt trước' : 'Mặt trước flashcard, bấm để lật thẻ'}
                onClick={handleFlip}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleFlip();
                  }
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transform: isCardCompressed ? 'scaleX(0.045)' : 'scaleX(1)',
                  opacity: isCardCompressed ? 0.72 : 1,
                  transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease',
                  transformOrigin: 'center',
                  willChange: 'transform',
                  pointerEvents: submitting ? 'none' : 'auto',
                  cursor: submitting ? 'wait' : 'pointer',
                  outline: 'none',
                  '&:focus-visible': {
                    boxShadow: '0 0 0 4px rgba(34,211,238,0.24)',
                    borderRadius: 1,
                  },
                }}
              >
                <CardFace accent={flipped ? '#22d3ee' : '#8b7cf6'}>
                  <Stack spacing={3} sx={{ alignItems: 'center' }}>
                    <Chip
                      label={flipped ? 'Mặt sau' : 'Mặt trước'}
                      size="small"
                      sx={{
                        bgcolor: flipped ? 'rgba(34,211,238,0.14)' : 'rgba(139,124,246,0.14)',
                        color: flipped ? '#9ff3ff' : '#c9c3ff',
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: flipped ? 800 : 900,
                        textAlign: 'center',
                        fontSize: flipped ? { xs: 25, sm: 33, md: 40 } : { xs: 30, sm: 40, md: 48 },
                        lineHeight: flipped ? 1.22 : 1.18,
                        maxWidth: flipped ? 650 : 620,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {flipped ? currentCard.backText : currentCard.frontText}
                    </Typography>
                    {flipped ? (
                      <Chip
                        label={`Độ khó: ${difficultyLabel(currentCard.difficultyLevel)}`}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.16)' }}
                      />
                    ) : (
                      <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                        Bấm vào thẻ để xem đáp án
                      </Typography>
                    )}
                  </Stack>
                </CardFace>
              </Box>
            </MotionBox>
          ) : (
            <MotionBox
              key="finished"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              sx={{
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1,
                border: '1px solid rgba(34,211,238,0.24)',
                bgcolor: 'rgba(255,255,255,0.04)',
                boxShadow: '0 24px 70px rgba(0,0,0,0.32)',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  Hoàn thành bộ thẻ
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
                  Tiến độ của bạn đã được lưu. Có thể học lại bộ này hoặc quay về danh sách khóa học.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button startIcon={<ReplayIcon />} variant="outlined" onClick={restartDeck}>
                    Học lại
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    Về dashboard
                  </Button>
                </Stack>
              </Stack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      <Box sx={{ minHeight: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <AnimatePresence>
          {flipped && actionsReady && !finished && (
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: 'min(92vw, 420px)', sm: 'auto' } }}>
                <Button fullWidth variant="outlined" color="error" disabled={submitting} onClick={() => handleEvaluation('HARD')} sx={{ minHeight: 48, py: 1, borderRadius: 1 }}>
                  Khó
                </Button>
                <Button fullWidth variant="outlined" color="warning" disabled={submitting} onClick={() => handleEvaluation('GOOD')} sx={{ minHeight: 48, py: 1, borderRadius: 1 }}>
                  Gần nhớ
                </Button>
                <Button fullWidth variant="contained" color="secondary" disabled={submitting} onClick={() => handleEvaluation('EASY')} sx={{ minHeight: 48, py: 1, borderRadius: 1 }}>
                  Đã nhớ
                </Button>
              </Stack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

function CardFace({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        p: { xs: 3, sm: 5, md: 6 },
        borderRadius: 1,
        bgcolor: 'rgba(19, 21, 34, 0.94)',
        border: `1px solid ${accent}66`,
        boxShadow: `0 24px 70px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.035)`,
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
}
