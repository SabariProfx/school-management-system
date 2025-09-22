import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/students")
      .then(response => response.json())
      .then(data => {
        setStudents(data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://127.0.0.1:5000/api/students", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newStudentName }),
    })
    .then(response => response.json())
    .then(data => {
      setStudents(data.students);
      setNewStudentName('');
    });
  };

  const handleDelete = (studentToDelete) => {
    // --- THIS IS THE FIX ---
    const encodedStudentName = encodeURIComponent(studentToDelete);
    fetch(`http://127.0.0.1:5000/api/students/${encodedStudentName}`, {
    // --------------------
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      setStudents(data.students);
    });
  };

  return (
    <div id="app-container">
      <h1>School Management System</h1>
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