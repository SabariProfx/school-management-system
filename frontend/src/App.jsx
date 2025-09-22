import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState(''); // State for the input field

  // This runs once to fetch the initial list of students
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/students")
      .then(response => response.json())
      .then(data => {
        setStudents(data);
      });
  }, []);

  // This function runs when the form is submitted
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from refreshing the page

    fetch("http://127.0.0.1:5000/api/students", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newStudentName }),
    })
    .then(response => response.json())
    .then(data => {
      // The backend sends back the updated list, so we update our state
      setStudents(data.students);
      // Clear the input box for the next entry
      setNewStudentName('');
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

      <UserList title="Students" users={students} />
    </div>
  )
}

export default App;