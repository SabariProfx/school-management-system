import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, CssBaseline, ThemeProvider, Container, AppBar, Toolbar } from '@mui/material';
import { theme } from './theme';
import UserList from './components/UserList.jsx'; // Import from the new components folder

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/students", {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      setStudents(data);
    } else {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    await fetch("http://127.0.0.1:5000/api/students", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newStudentName }),
    });
    fetchStudents();
    setNewStudentName('');
  };

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`http://127.0.0.1:5000/api/students/${studentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchStudents();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1E1E1E' }}>
        <AppBar position="static" sx={{ background: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Poppins' }}>
              Classmate+ Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, background: 'rgba(45, 45, 45, 0.75)', borderRadius: '8px' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Add New Student</Typography>
            <TextField fullWidth label="Student Name" variant="outlined" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" size="large">Add Student</Button>
          </Box>
          <UserList title="Enrolled Students" users={students} onDelete={handleDelete} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;