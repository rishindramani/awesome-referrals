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

// In-memory database for development
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

const companies = [
  {
    id: '1',
    name: 'Google',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
    website: 'https://google.com',
    industry: 'Technology',
    description: 'A multinational technology company specializing in Internet-related services and products.'
  },
  {
    id: '2',
    name: 'Microsoft',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    website: 'https://microsoft.com',
    industry: 'Technology',
    description: 'A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.'
  },
  {
    id: '3',
    name: 'Amazon',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png',
    website: 'https://amazon.com',
    industry: 'Technology',
    description: 'An American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.'
  }
];

const jobs = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'We are looking for a Software Engineer to join our team.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in software development.',
    location: 'Mountain View, CA',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 120000,
    salary_max: 180000,
    application_url: 'https://google.com/careers',
    company_id: '1',
    is_remote: false,
    skills: ['JavaScript', 'React', 'Node.js']
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'We are looking for a Product Manager to join our team.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in product management.',
    location: 'Seattle, WA',
    job_type: 'full-time',
    experience_level: 'senior',
    salary_min: 140000,
    salary_max: 200000,
    application_url: 'https://microsoft.com/careers',
    company_id: '2',
    is_remote: false,
    skills: ['Product Management', 'Agile', 'Scrum']
  },
  {
    id: '3',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer to join our team.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 2+ years of experience in frontend development.',
    location: 'Remote',
    job_type: 'full-time',
    experience_level: 'entry',
    salary_min: 100000,
    salary_max: 150000,
    application_url: 'https://amazon.com/careers',
    company_id: '3',
    is_remote: true,
    skills: ['JavaScript', 'React', 'CSS', 'HTML']
  },
  {
    id: '4',
    title: 'Backend Developer',
    description: 'We are looking for a Backend Developer to join our team.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in backend development.',
    location: 'Remote',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: 110000,
    salary_max: 170000,
    application_url: 'https://amazon.com/careers',
    company_id: '3',
    is_remote: true,
    skills: ['Java', 'Spring', 'AWS', 'Microservices']
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'We are looking for a Data Scientist to join our team.',
    requirements: 'Master\'s or PhD in Computer Science, Statistics, or related field. 3+ years of experience in data science.',
    location: 'Mountain View, CA',
    job_type: 'full-time',
    experience_level: 'senior',
    salary_min: 150000,
    salary_max: 220000,
    application_url: 'https://google.com/careers',
    company_id: '1',
    is_remote: false,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis']
  }
];

const savedJobs = [];

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
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
app.get('/api/auth/me', authMiddleware, (req, res) => {
  // In a real app, we would verify the token and get the user
  // For now, we'll just return a mock user
  
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user.id,
      email: 'user@example.com',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'job_seeker'
    }
  });
});

// Get all jobs with filtering
app.get('/api/jobs', (req, res) => {
  const {
    title,
    company,
    location,
    remote,
    type,
    experience_level,
    salary_min,
    salary_max,
    skills,
    page = 1,
    limit = 10,
    sort_by = 'id',
    sort_dir = 'DESC'
  } = req.query;

  // Filter jobs based on query parameters
  let filteredJobs = [...jobs];
  
  if (title) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  if (company) {
    const companyIds = companies
      .filter(c => c.name.toLowerCase().includes(company.toLowerCase()))
      .map(c => c.id);
      
    filteredJobs = filteredJobs.filter(job => companyIds.includes(job.company_id));
  }
  
  if (location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (remote === 'true') {
    filteredJobs = filteredJobs.filter(job => job.is_remote);
  } else if (remote === 'false') {
    filteredJobs = filteredJobs.filter(job => !job.is_remote);
  }
  
  if (type) {
    filteredJobs = filteredJobs.filter(job => job.job_type === type);
  }
  
  if (experience_level) {
    filteredJobs = filteredJobs.filter(job => job.experience_level === experience_level);
  }
  
  if (salary_min) {
    filteredJobs = filteredJobs.filter(job => job.salary_min >= parseInt(salary_min));
  }
  
  if (salary_max) {
    filteredJobs = filteredJobs.filter(job => job.salary_max <= parseInt(salary_max));
  }
  
  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
    filteredJobs = filteredJobs.filter(job => 
      job.skills.some(s => skillsArray.includes(s.toLowerCase()))
    );
  }
  
  // Calculate total
  const total = filteredJobs.length;
  
  // Apply pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  
  // Apply sorting
  filteredJobs.sort((a, b) => {
    if (sort_dir.toUpperCase() === 'ASC') {
      return a[sort_by] > b[sort_by] ? 1 : -1;
    } else {
      return a[sort_by] < b[sort_by] ? 1 : -1;
    }
  });
  
  // Paginate results
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  // Enrich job data with company information
  const enrichedJobs = paginatedJobs.map(job => {
    const company = companies.find(c => c.id === job.company_id);
    
    // Check if job is saved by the current user if authenticated
    let isSaved = false;
    if (req.user) {
      isSaved = savedJobs.some(sj => sj.job_id === job.id && sj.user_id === req.user.id);
    }
    
    return {
      ...job,
      company,
      isSaved
    };
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(total / parseInt(limit));
  
  res.status(200).json({
    status: 'success',
    results: enrichedJobs.length,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: totalPages
    },
    data: {
      jobs: enrichedJobs
    }
  });
});

// Advanced search for jobs
app.get('/api/jobs/search', (req, res) => {
  const {
    query,
    location,
    remote,
    company_ids,
    job_types,
    experience_levels,
    salary_min,
    salary_max,
    skills,
    posted_within,
    page = 1,
    limit = 10,
    sort_by = 'relevance',
    sort_dir = 'DESC'
  } = req.query;
  
  // Filter jobs based on query parameters
  let filteredJobs = [...jobs];
  
  if (query) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      job.requirements.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (remote === 'true') {
    filteredJobs = filteredJobs.filter(job => job.is_remote);
  } else if (remote === 'false') {
    filteredJobs = filteredJobs.filter(job => !job.is_remote);
  }
  
  if (company_ids) {
    const companyIdArray = company_ids.split(',');
    filteredJobs = filteredJobs.filter(job => companyIdArray.includes(job.company_id));
  }
  
  if (job_types) {
    const jobTypeArray = job_types.split(',');
    filteredJobs = filteredJobs.filter(job => jobTypeArray.includes(job.job_type));
  }
  
  if (experience_levels) {
    const experienceLevelArray = experience_levels.split(',');
    filteredJobs = filteredJobs.filter(job => experienceLevelArray.includes(job.experience_level));
  }
  
  if (salary_min) {
    filteredJobs = filteredJobs.filter(job => job.salary_min >= parseInt(salary_min));
  }
  
  if (salary_max) {
    filteredJobs = filteredJobs.filter(job => job.salary_max <= parseInt(salary_max));
  }
  
  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
    filteredJobs = filteredJobs.filter(job => 
      job.skills.some(s => skillsArray.includes(s.toLowerCase()))
    );
  }
  
  // Calculate total
  const total = filteredJobs.length;
  
  // Apply sorting
  if (sort_by === 'relevance' && query) {
    // Sort by relevance: exact matches in title first, then description
    filteredJobs.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return 0;
    });
  } else if (sort_by === 'date') {
    // Sort by ID as a proxy for date in our mock data
    filteredJobs.sort((a, b) => {
      if (sort_dir.toUpperCase() === 'ASC') {
        return parseInt(a.id) > parseInt(b.id) ? 1 : -1;
      } else {
        return parseInt(a.id) < parseInt(b.id) ? 1 : -1;
      }
    });
  } else if (sort_by === 'salary') {
    // Sort by salary_max
    filteredJobs.sort((a, b) => {
      if (sort_dir.toUpperCase() === 'ASC') {
        return a.salary_max > b.salary_max ? 1 : -1;
      } else {
        return a.salary_max < b.salary_max ? 1 : -1;
      }
    });
  }
  
  // Apply pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  
  // Paginate results
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  // Enrich job data with company information
  const enrichedJobs = paginatedJobs.map(job => {
    const company = companies.find(c => c.id === job.company_id);
    
    // Check if job is saved by the current user if authenticated
    let isSaved = false;
    if (req.user) {
      isSaved = savedJobs.some(sj => sj.job_id === job.id && sj.user_id === req.user.id);
    }
    
    return {
      ...job,
      company,
      isSaved
    };
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(total / parseInt(limit));
  
  res.status(200).json({
    status: 'success',
    results: enrichedJobs.length,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: totalPages
    },
    data: {
      jobs: enrichedJobs
    }
  });
});

// Get a single job by ID
app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return res.status(404).json({
      status: 'error',
      message: 'Job not found'
    });
  }
  
  const company = companies.find(c => c.id === job.company_id);
  
  // Check if job is saved by the current user if authenticated
  let isSaved = false;
  if (req.user) {
    isSaved = savedJobs.some(sj => sj.job_id === job.id && sj.user_id === req.user.id);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      job: {
        ...job,
        company,
        isSaved
      }
    }
  });
});

// Get trending/recommended jobs
app.get('/api/jobs/trending', (req, res) => {
  // For now, just return 3 random jobs
  const trendingJobs = jobs.slice(0, 3).map(job => {
    const company = companies.find(c => c.id === job.company_id);
    
    return {
      ...job,
      company
    };
  });
  
  res.status(200).json({
    status: 'success',
    results: trendingJobs.length,
    data: {
      jobs: trendingJobs
    }
  });
});

// Get saved jobs for current user
app.get('/api/jobs/saved', authMiddleware, (req, res) => {
  const userSavedJobs = savedJobs
    .filter(sj => sj.user_id === req.user.id)
    .map(sj => {
      const job = jobs.find(j => j.id === sj.job_id);
      const company = companies.find(c => c.id === job.company_id);
      
      return {
        ...job,
        company,
        isSaved: true
      };
    });
    
  res.status(200).json({
    status: 'success',
    results: userSavedJobs.length,
    data: {
      jobs: userSavedJobs
    }
  });
});

// Save a job
app.post('/api/jobs/:id/save', authMiddleware, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Check if job exists
  const job = jobs.find(j => j.id === id);
  if (!job) {
    return res.status(404).json({
      status: 'error',
      message: 'Job not found'
    });
  }
  
  // Check if already saved
  const existingSave = savedJobs.find(sj => sj.job_id === id && sj.user_id === userId);
  
  if (existingSave) {
    return res.status(200).json({
      status: 'success',
      message: 'Job already saved'
    });
  }
  
  // Save the job
  savedJobs.push({
    id: Date.now().toString(),
    user_id: userId,
    job_id: id,
    created_at: new Date().toISOString()
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Job saved successfully'
  });
});

// Unsave a job
app.delete('/api/jobs/:id/save', authMiddleware, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Find the saved job index
  const savedJobIndex = savedJobs.findIndex(sj => sj.job_id === id && sj.user_id === userId);
  
  if (savedJobIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Job not found in saved jobs'
    });
  }
  
  // Remove the saved job
  savedJobs.splice(savedJobIndex, 1);
  
  res.status(200).json({
    status: 'success',
    message: 'Job removed from saved jobs'
  });
});

// Get all companies
app.get('/api/companies', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: companies.length,
    data: {
      companies
    }
  });
});

// Get a single company by ID
app.get('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  
  const company = companies.find(c => c.id === id);
  
  if (!company) {
    return res.status(404).json({
      status: 'error',
      message: 'Company not found'
    });
  }
  
  // Get jobs for this company
  const companyJobs = jobs
    .filter(job => job.company_id === id)
    .map(job => {
      // Check if job is saved by the current user if authenticated
      let isSaved = false;
      if (req.user) {
        isSaved = savedJobs.some(sj => sj.job_id === job.id && sj.user_id === req.user.id);
      }
      
      return {
        ...job,
        isSaved
      };
    });
  
  res.status(200).json({
    status: 'success',
    data: {
      company: {
        ...company,
        jobs: companyJobs
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Development server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 