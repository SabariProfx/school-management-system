import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Box, Typography, Link as MuiLink, CssBaseline, ThemeProvider, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { theme, gradientAnimation } from '../theme';
import toast from 'react-hot-toast';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email format.", { id: 'email-validation' });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be 8+ characters and include an uppercase letter, a number, and a special character.', { id: 'password-strength' });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { id: 'password-match' });
      return;
    }
    
    const loadingToast = toast.loading('Creating account...');
    const response = await fetch('http://127.0.0.1:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    toast.dismiss(loadingToast);
    
    if (response.ok) {
      toast.success('Account created successfully!');
      navigate('/login');
    } else {
      toast.error(data.error || 'Registration failed.', { id: 'api-error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, background: 'linear-gradient(225deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', backgroundSize: '400% 400%', animation: `${gradientAnimation} 25s ease infinite` }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: { xs: '100%', sm: 420 }, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column' }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
              Create Account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Get started with Classmate+
            </Typography>
          </Box>
          <TextField fullWidth label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField fullWidth label="Email Address" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField 
            fullWidth 
            label="Password" 
            type={showPassword ? 'text' : 'password'}
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={(e) => e.preventDefault()} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField 
            fullWidth 
            label="Confirm Password" 
            type={showConfirmPassword ? 'text' : 'password'}
            margin="normal" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} onMouseDown={(e) => e.preventDefault()} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, mt: 3, mb: 2, fontWeight: 'bold', background: 'linear-gradient(90deg, #BB86FC, #4A90E2)', backgroundSize: '200% 200%', animation: `${gradientAnimation} 5s ease infinite`, border: 'none', color: 'white', transition: 'box-shadow .3s ease-in-out', '&:hover': { boxShadow: '0 0 12px rgba(187, 134, 252, 0.6)' } }}>
            Sign Up
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{' '}
            <MuiLink component={RouterLink} to="/login" fontWeight="bold" color="primary">
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Register;