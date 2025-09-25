import { createTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#1E1E1E' },
    primary: { main: '#4A90E2' },
    text: { primary: '#EAEAEA', secondary: '#A0A0A0' },
  },
  typography: {
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: { fontWeight: 300 },
    h1: { fontWeight: 300 }
  },
});

export const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;