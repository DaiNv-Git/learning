import { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import LearningService from '../services/learning.service';

export default function FlashcardStudy() {
  const { courseId } = useParams();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const navigate = useNavigate();
  
  useEffect(() => {
    LearningService.getFlashcards(1) // hardcoded deck 1 for demo
      .then(res => {
        setFlashcards(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [courseId]);

  const handleEvaluation = (evaluation: string) => {
    const card = flashcards[currentIndex];
    // Start exit animation immediately without flipping back
    setDirection(1);
    
    LearningService.submitFlashcardProgress(card.id, evaluation).then(() => {
      // Transition logic
      if (currentIndex < flashcards.length - 1) {
        setFlipped(false); // Reset flip state for the next card silently
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("Congratulations! You have finished this deck.");
        navigate('/dashboard');
      }
    });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      <CircularProgress color="secondary" size={60} thickness={4} sx={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' }} />
    </Box>
  );
  
  if (flashcards.length === 0) return (
    <Box sx={{ p: 5, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" color="text.secondary">No flashcards found in this deck.</Typography>
    </Box>
  );

  const currentCard = flashcards[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 30, left: 30, zIndex: 10 }}>
        <IconButton 
          onClick={() => navigate('/dashboard')} 
          sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'text.primary', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #b966fe 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Study Mode
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Card {currentIndex + 1} <span style={{ opacity: 0.5 }}>of</span> {flashcards.length}
        </Typography>
      </Box>
      
      {/* Flashcard Container */}
      <Box sx={{ perspective: 1500, width: { xs: '90%', sm: 600 }, height: 350, position: 'relative' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
              onClick={() => setFlipped(!flipped)}
            >
              {/* Front side */}
              <Card sx={{ 
                position: 'absolute', width: '100%', height: '100%', 
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(185,102,254,0.3)', p: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(185,102,254,0.1)'
              }}>
                <Typography variant="h3" color="text.primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{currentCard.frontText}</Typography>
                <Typography variant="caption" sx={{ position: 'absolute', bottom: 20, color: 'text.secondary', opacity: 0.5 }}>Tap to flip</Typography>
              </Card>

              {/* Back side */}
              <Card sx={{ 
                position: 'absolute', width: '100%', height: '100%', 
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,229,255,0.3)', p: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,229,255,0.1)'
              }}>
                <Typography variant="h4" color="text.primary" sx={{ textAlign: 'center' }}>{currentCard.backText}</Typography>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Box>
      
      {/* Evaluation Buttons */}
      <Box sx={{ height: 100, mt: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {flipped && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.9 }} 
              transition={{ duration: 0.4, type: "spring" }}
              style={{ display: 'flex', gap: 24 }}
            >
              <Button variant="outlined" size="large" onClick={(e) => { e.stopPropagation(); handleEvaluation('HARD'); }} sx={{ color: '#ff4b4b', borderColor: '#ff4b4b', '&:hover': { background: 'rgba(255,75,75,0.1)', borderColor: '#ff4b4b' }, borderRadius: '50px', px: 4, py: 1.5 }}>
                Hard
              </Button>
              <Button variant="outlined" size="large" onClick={(e) => { e.stopPropagation(); handleEvaluation('GOOD'); }} sx={{ color: '#ffc107', borderColor: '#ffc107', '&:hover': { background: 'rgba(255,193,7,0.1)', borderColor: '#ffc107' }, borderRadius: '50px', px: 4, py: 1.5 }}>
                Good
              </Button>
              <Button variant="contained" size="large" onClick={(e) => { e.stopPropagation(); handleEvaluation('EASY'); }} sx={{ background: 'linear-gradient(135deg, #00e5ff 0%, #00b1cb 100%)', color: '#000', '&:hover': { background: 'linear-gradient(135deg, #33ebff 0%, #00c7e5 100%)' }, borderRadius: '50px', px: 4, py: 1.5, fontWeight: 'bold' }}>
                Easy
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
