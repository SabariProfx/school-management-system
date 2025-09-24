import { Link } from 'react-router-dom'; // Import the Link component
import './App.css';

function App() {
  return (
    <div id="app-container">
      <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      
      <h1>Welcome to the School Management Dashboard</h1>
      {/* We will add the student list back here later for logged-in users */}
    </div>
  )
}

export default App;