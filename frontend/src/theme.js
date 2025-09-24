import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#1E1E1E' },
    primary: {
      main: '#BB86FC', // New, sophisticated purple accent
    },
    text: {
      primary: '#EAEAEA',
      secondary: '#A0A0A0',
    },
  },
  typography: {
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: { fontWeight: 600 },
  },
});