import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, CssBaseline, ThemeProvider, Container, AppBar, Toolbar } from '@mui/material';
import { theme } from './theme';
import UserList from './components/UserList.jsx';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        fetchStudents(token);
      } catch (error) {
        // Handle invalid token
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStudents = async (token) => {
    const response = await fetch("http://127.0.0.1:5000/api/students", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setStudents(data);
    } else if (response.status === 403) {
      // If a student tries to access, they'll get a 403 Forbidden
      // We can just show an empty list or a message
      console.log("Access denied: User is not a teacher.");
      setStudents([]); // Clear the list for non-teachers
    } else {
      // Handle other errors like token expiration
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    const response = await fetch("http://127.0.0.1:5000/api/students", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: newStudentName }),
    });
     if (response.ok) {
        toast.success(`${newStudentName} added successfully!`);
        fetchStudents(token);
        setNewStudentName('');
    } else {
        toast.error("Failed to add student.");
    }
  };

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        toast.success('Student removed.');
        fetchStudents(token);
    } else {
        toast.error("Failed to remove student.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully!');
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
            {userRole && <Typography sx={{ mr: 2, textTransform: 'capitalize' }}>Role: {userRole}</Typography>}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {userRole === 'teacher' && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, background: 'rgba(45, 45, 45, 0.75)', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Add New Student</Typography>
              <TextField fullWidth label="Student Name" variant="outlined" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" size="large">Add Student</Button>
            </Box>
          )}
          
          {userRole === 'student' && (
            <Box sx={{ mb: 4, p: 3, background: 'rgba(45, 45, 45, 0.75)', borderRadius: '8px' }}>
              <Typography variant="h5">Welcome, Student!</Typography>
              <Typography>This is your dashboard. The student list is only visible to teachers.</Typography>
            </Box>
          )}
          
          {userRole === 'teacher' && (
            <UserList title="Enrolled Students" users={students} onDelete={handleDelete} userRole={userRole} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;