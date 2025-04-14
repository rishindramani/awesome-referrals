const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Mock user database
const users = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password: 'password', // In a real app, this would be hashed
    first_name: 'Test',
    last_name: 'User',
    user_type: 'job_seeker'
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName, userType } = req.body;
  
  // Check if user already exists
  if (users[email]) {
    return res.status(400).json({
      status: 'error',
      message: 'User already exists with this email'
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In a real app, this would be hashed
    first_name: firstName,
    last_name: lastName,
    user_type: userType || 'job_seeker'
  };
  
  // Add to mock database
  users[email] = newUser;
  
  // Create and send token
  const token = jwt.sign({ id: newUser.id }, 'your_jwt_secret_key', {
    expiresIn: '1h'
  });
  
  // Send response without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    status: 'success',
    token,
    user: userWithoutPassword
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password'
    });
  }
  
  // Check if user exists
  const user = users[email];
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Incorrect email or password'
    });
  }
  
  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).json({
      status: 'error',
      message: 'Incorrect email or password'
    });
  }
  
  // Create and send token
  const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key', {
    expiresIn: '1h'
  });
  
  // Send response without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    status: 'success',
    token,
    user: userWithoutPassword
  });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  // In a real app, we would verify the token and get the user
  // For now, we'll just return a mock user
  
  res.status(200).json({
    status: 'success',
    user: {
      id: '1',
      email: 'user@example.com',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'job_seeker'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 