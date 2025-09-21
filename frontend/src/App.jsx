import { useState, useEffect } from 'react';
import './App.css'; // We'll re-add this for future styling

function App() {
  const [users, setUsers] = useState({ students: [], teachers: [] });

  useEffect(() => {
    // Fetch data from our Flask API endpoint
    fetch("http://127.0.0.1:5000/api/users")
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      });
  }, []); // The empty array tells React to run this effect only once

  return (
    <div>
      <h1>School Management System</h1>

      <h2>Students</h2>
      <ul>
        {users.students.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>

      <h2>Teachers</h2>
      <ul>
        {users.teachers.map((teacher, index) => (
          <li key={index}>{teacher}</li>
        ))}
      </ul>
    </div>
  )
}

export default App