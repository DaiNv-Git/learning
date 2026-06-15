import { createTheme } from '@mui/material';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/700.css';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b966fe',
      light: '#d69eff',
      dark: '#852ed0',
    },
    secondary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b1cb',
    },
    background: {
      default: '#070511', // Deep space dark
      paper: 'rgba(255, 255, 255, 0.03)', // Translucent paper for glass effect
    },
    text: {
      primary: '#f8f9fa',
      secondary: '#adb5bd',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-1.5px' },
    h2: { fontWeight: 700, letterSpacing: '-1px' },
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1.05rem',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#070511',
          backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(185, 102, 254, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 229, 255, 0.08), transparent 25%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-2px)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #b966fe 0%, #852ed0 100%)',
            boxShadow: '0 4px 15px 0 rgba(185, 102, 254, 0.4)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px 0 rgba(185, 102, 254, 0.6)',
              background: 'linear-gradient(135deg, #c582ff 0%, #9947e5 100%)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: 'linear-gradient(135deg, #00e5ff 0%, #00b1cb 100%)',
            boxShadow: '0 4px 15px 0 rgba(0, 229, 255, 0.4)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px 0 rgba(0, 229, 255, 0.6)',
              background: 'linear-gradient(135deg, #33ebff 0%, #00c7e5 100%)',
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b966fe',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 0 20px rgba(185, 102, 254, 0.15)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          backgroundImage: 'none',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
