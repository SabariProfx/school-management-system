import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import './App.css';

function App() {
  const [users, setUsers] = useState({ students: [], teachers: [] });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/users")
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      });
  }, []);

  return (
    <div id="app-container">
      <h1>School Management System</h1>
      <UserList title="Students" users={users.students} />
      <UserList title="Teachers" users={users.teachers} />
    </div>
  )
}

export default App;