import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserList from './components/UserList';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login'); // If no token, redirect to login
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/students", {
      headers: {
        'Authorization': `Bearer ${token}` // Send the token
      }
    });

    if (response.ok) {
      const data = await response.json();
      setStudents(data);
    } else {
      // This can happen if the token is expired
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
    <div id="app-container">
      <nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <h1>School Management Dashboard</h1>
      <form onSubmit={handleSubmit} className="add-student-form">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter new student name"
        />
        <button type="submit">Add Student</button>
      </form>
      <UserList title="Students" users={students} onDelete={handleDelete} />
    </div>
  )
}

export default App;