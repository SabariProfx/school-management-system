import { useState } from 'react';
import { Button, TextField, Box, Typography, Link as MuiLink, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { keyframes } from '@mui/system';

// --- THEME DEFINITION ---
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#1E1E1E' },
    primary: { main: '#BB86FC' }, // Using the purple accent
    text: { primary: '#EAEAEA', secondary: '#A0A0A0' },
  },
  typography: {
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: { fontWeight: 600 },
  },
});

// --- ANIMATION DEFINITION ---
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- THE MAIN COMPONENT ---
function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(`Logging in with: ${username}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          background: 'linear-gradient(225deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          backgroundSize: '400% 400%',
          animation: `${gradientAnimation} 25s ease infinite`,
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            background: 'rgba(30, 30, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxWidth: { xs: '100%', sm: 420 },
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
              Classmate
              <Box 
                component="span" 
                sx={{ 
                  fontWeight: 300,
                  background: 'linear-gradient(90deg, #BB86FC, #4A90E2)',
                  backgroundSize: '200% 200%',
                  animation: `${gradientAnimation} 5s ease infinite`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                +
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Educational Excellence Platform
            </Typography>
          </Box>
          <TextField fullWidth label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ 
              py: 1.5, 
              mt: 3, 
              mb: 2, 
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #BB86FC, #4A90E2)',
              backgroundSize: '200% 200%',
              animation: `${gradientAnimation} 5s ease infinite`,
              border: 'none',
              color: 'white',
              transition: 'box-shadow .3s ease-in-out',
              '&:hover': {
                // --- THIS IS THE CHANGE ---
                boxShadow: '0 0 12px rgba(187, 134, 252, 0.6)',
              }
            }}
          >
            Sign In
          </Button>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, letterSpacing: '1px', fontSize: '0.7rem' }}>
            SECURE ACCESS
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;