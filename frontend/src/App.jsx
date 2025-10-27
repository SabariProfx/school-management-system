import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme'; // Ensure you have this theme file

function App() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Loading state while checking token
  if (userRole === null) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ backgroundColor: '#1E1E1E', minHeight: '100vh' }} />
      </ThemeProvider>
    );
  }

  // Render the correct dashboard based on the role
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {userRole === 'student' && <StudentDashboard />}
      {userRole === 'teacher' && <TeacherDashboard />}
    </ThemeProvider>
  );
}

export default App;