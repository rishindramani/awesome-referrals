const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Secret key for JWT
const JWT_SECRET = 'awesome-referrals-secret-key';

// Mock database
const db = {
  users: [],
  jobs: [
    {
      id: '1',
      title: 'Senior Backend Engineer',
      company: {
        id: '1',
        name: 'Google',
        logo_url: 'https://logo.clearbit.com/google.com'
      },
      location: 'Mountain View, CA',
      salary_range: '$150K - $180K',
      job_type: 'Full-time',
      experience_level: 'Senior',
      is_remote: false,
      description: 'We are looking for a senior backend engineer to join our cloud infrastructure team.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience in backend development',
        'Strong proficiency in at least one of the following: Python, Java, or Go'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: {
        id: '2',
        name: 'Facebook',
        logo_url: 'https://logo.clearbit.com/facebook.com'
      },
      location: 'Remote',
      salary_range: '$120K - $150K',
      job_type: 'Full-time',
      experience_level: 'Mid-level',
      is_remote: true,
      description: 'Join our team to build responsive and performant web applications.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of experience with frontend development',
        'Proficiency in React, JavaScript/TypeScript, and modern frontend frameworks'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  companies: [
    {
      id: '1',
      name: 'Google',
      logo_url: 'https://logo.clearbit.com/google.com',
      description: 'Google is a multinational technology company specializing in Internet-related services and products.',
      website: 'https://google.com',
      industry: 'Technology',
      location: 'Mountain View, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Facebook',
      logo_url: 'https://logo.clearbit.com/facebook.com',
      description: 'Facebook is a social media and technology company that builds products to enable people to connect and share.',
      website: 'https://facebook.com',
      industry: 'Technology',
      location: 'Menlo Park, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  referrals: [],
  conversations: [],
  messages: []
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again'
    });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running',
    environment: 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    apis: {
      auth: 'READY',
      jobs: 'READY',
      referrals: 'READY',
      companies: 'READY',
      notifications: 'READY',
      conversations: 'READY',
      messages: 'READY'
    }
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { first_name, last_name, email, password, user_type } = req.body;
  
  if (!first_name || !last_name || !email || !password || !user_type) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields'
    });
  }
  
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email already in use'
    });
  }
  
  const id = uuidv4();
  const newUser = {
    id,
    first_name,
    last_name,
    email,
    password, // In a real app, this would be hashed
    user_type,
    verified: false,
    profile: {
      avatar_url: null,
      current_position: null,
      resume_url: null,
      linkedin_profile: null,
      skills: []
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.users.push(newUser);
  
  const token = generateToken(id);
  
  res.status(201).json({
    status: 'success',
    token,
    user: {
      id,
      first_name,
      last_name,
      email,
      user_type,
      verified: false,
      profile: newUser.profile,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }
  
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password'
    });
  }
  
  const token = generateToken(user.id);
  
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      verified: user.verified,
      profile: user.profile,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        user_type: req.user.user_type,
        verified: req.user.verified,
        profile: req.user.profile,
        created_at: req.user.created_at,
        updated_at: req.user.updated_at
      }
    }
  });
});

// Jobs routes
app.get('/api/jobs', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const offset = (page - 1) * limit;
  const paginatedJobs = db.jobs.slice(offset, offset + parseInt(limit));
  
  res.status(200).json({
    status: 'success',
    data: {
      jobs: paginatedJobs,
      pagination: {
        total: db.jobs.length,
        page: parseInt(page),
        pages: Math.ceil(db.jobs.length / limit),
        limit: parseInt(limit)
      }
    }
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = db.jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      status: 'fail',
      message: 'Job not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  });
});

// Companies routes
app.get('/api/companies', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const offset = (page - 1) * limit;
  const paginatedCompanies = db.companies.slice(offset, offset + parseInt(limit));
  
  res.status(200).json({
    status: 'success',
    data: {
      companies: paginatedCompanies,
      pagination: {
        total: db.companies.length,
        page: parseInt(page),
        pages: Math.ceil(db.companies.length / limit),
        limit: parseInt(limit)
      }
    }
  });
});

app.get('/api/companies/:id', (req, res) => {
  const company = db.companies.find(c => c.id === req.params.id);
  
  if (!company) {
    return res.status(404).json({
      status: 'fail',
      message: 'Company not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      company
    }
  });
});

// Referrals routes
app.post('/api/referrals', authenticate, (req, res) => {
  const { job_id, referrer_id, message, resume_url, linkedin_profile } = req.body;
  
  const job = db.jobs.find(j => j.id === job_id);
  const referrer = db.users.find(u => u.id === referrer_id);
  
  if (!job || !referrer) {
    return res.status(404).json({
      status: 'fail',
      message: 'Job or referrer not found'
    });
  }
  
  const id = uuidv4();
  const newReferral = {
    id,
    job_id,
    job,
    referrer_id,
    referrer: {
      id: referrer.id,
      first_name: referrer.first_name,
      last_name: referrer.last_name,
      email: referrer.email,
      profile: referrer.profile
    },
    seeker_id: req.user.id,
    seeker: {
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      profile: req.user.profile
    },
    message,
    resume_url,
    linkedin_profile,
    status: 'pending',
    notes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.referrals.push(newReferral);
  
  res.status(201).json({
    status: 'success',
    data: {
      referralRequest: newReferral
    }
  });
});

app.get('/api/referrals/requests', authenticate, (req, res) => {
  const { sent, received } = req.query;
  let referralRequests = [];
  
  if (sent === 'true') {
    referralRequests = db.referrals.filter(r => r.seeker_id === req.user.id);
  } else if (received === 'true') {
    referralRequests = db.referrals.filter(r => r.referrer_id === req.user.id);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      referralRequests
    }
  });
});

app.get('/api/referrals/:id', authenticate, (req, res) => {
  const referral = db.referrals.find(r => r.id === req.params.id);
  
  if (!referral) {
    return res.status(404).json({
      status: 'fail',
      message: 'Referral request not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      referralRequest: referral
    }
  });
});

app.put('/api/referrals/requests/:id/approve', authenticate, (req, res) => {
  const referral = db.referrals.find(r => r.id === req.params.id);
  
  if (!referral) {
    return res.status(404).json({
      status: 'fail',
      message: 'Referral request not found'
    });
  }
  
  if (referral.referrer_id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to approve this referral request'
    });
  }
  
  referral.status = 'approved';
  referral.updated_at = new Date().toISOString();
  
  res.status(200).json({
    status: 'success',
    data: {
      referralRequest: referral
    }
  });
});

app.put('/api/referrals/requests/:id/reject', authenticate, (req, res) => {
  const referral = db.referrals.find(r => r.id === req.params.id);
  
  if (!referral) {
    return res.status(404).json({
      status: 'fail',
      message: 'Referral request not found'
    });
  }
  
  if (referral.referrer_id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to reject this referral request'
    });
  }
  
  referral.status = 'rejected';
  referral.updated_at = new Date().toISOString();
  
  res.status(200).json({
    status: 'success',
    data: {
      referralRequest: referral
    }
  });
});

// Conversations routes
app.get('/api/conversations', authenticate, (req, res) => {
  // Find conversations where the current user is involved
  const conversations = db.conversations.filter(c => 
    c.participants.some(p => p.user_id === req.user.id)
  );
  
  // For each conversation, calculate unread count
  const conversationsWithDetails = conversations.map(conversation => {
    const otherParticipant = conversation.participants.find(p => p.user_id !== req.user.id);
    const otherUser = db.users.find(u => u.id === otherParticipant.user_id);
    
    // Get last message
    const messages = db.messages.filter(m => m.conversation_id === conversation.id);
    const lastMessage = messages.length > 0 ? 
      messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] : null;
    
    // Calculate unread count
    const unreadCount = messages.filter(m => 
      m.sender_id !== req.user.id && !m.is_read
    ).length;
    
    return {
      id: conversation.id,
      users: [
        {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          profile: req.user.profile
        },
        {
          id: otherUser.id,
          first_name: otherUser.first_name,
          last_name: otherUser.last_name,
          profile: otherUser.profile
        }
      ],
      last_message: lastMessage,
      unread_count: unreadCount,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at
    };
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      conversations: conversationsWithDetails
    }
  });
});

app.post('/api/conversations', authenticate, (req, res) => {
  const { recipient_id } = req.body;
  
  if (!recipient_id) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide recipient_id'
    });
  }
  
  const recipient = db.users.find(u => u.id === recipient_id);
  
  if (!recipient) {
    return res.status(404).json({
      status: 'fail',
      message: 'Recipient not found'
    });
  }
  
  // Check if conversation already exists
  const existingConversation = db.conversations.find(c => 
    c.participants.some(p => p.user_id === req.user.id) && 
    c.participants.some(p => p.user_id === recipient_id)
  );
  
  if (existingConversation) {
    // Return existing conversation
    const otherParticipant = existingConversation.participants.find(p => p.user_id !== req.user.id);
    const otherUser = db.users.find(u => u.id === otherParticipant.user_id);
    
    return res.status(200).json({
      status: 'success',
      data: {
        conversation: {
          id: existingConversation.id,
          users: [
            {
              id: req.user.id,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
              profile: req.user.profile
            },
            {
              id: otherUser.id,
              first_name: otherUser.first_name,
              last_name: otherUser.last_name,
              profile: otherUser.profile
            }
          ],
          created_at: existingConversation.created_at,
          updated_at: existingConversation.updated_at
        }
      }
    });
  }
  
  // Create new conversation
  const id = uuidv4();
  const newConversation = {
    id,
    participants: [
      { user_id: req.user.id },
      { user_id: recipient_id }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.conversations.push(newConversation);
  
  res.status(201).json({
    status: 'success',
    data: {
      conversation: {
        id,
        users: [
          {
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            profile: req.user.profile
          },
          {
            id: recipient.id,
            first_name: recipient.first_name,
            last_name: recipient.last_name,
            profile: recipient.profile
          }
        ],
        created_at: newConversation.created_at,
        updated_at: newConversation.updated_at
      }
    }
  });
});

app.get('/api/conversations/:id/messages', authenticate, (req, res) => {
  const conversationId = req.params.id;
  
  const conversation = db.conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Conversation not found'
    });
  }
  
  // Check if user is part of conversation
  if (!conversation.participants.some(p => p.user_id === req.user.id)) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to view this conversation'
    });
  }
  
  const messages = db.messages
    .filter(m => m.conversation_id === conversationId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  res.status(200).json({
    status: 'success',
    data: {
      messages
    }
  });
});

app.post('/api/conversations/:id/messages', authenticate, (req, res) => {
  const conversationId = req.params.id;
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide message content'
    });
  }
  
  const conversation = db.conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Conversation not found'
    });
  }
  
  // Check if user is part of conversation
  if (!conversation.participants.some(p => p.user_id === req.user.id)) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to send messages in this conversation'
    });
  }
  
  const id = uuidv4();
  const newMessage = {
    id,
    conversation_id: conversationId,
    sender_id: req.user.id,
    content,
    is_read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.messages.push(newMessage);
  
  // Update conversation timestamp
  conversation.updated_at = new Date().toISOString();
  
  res.status(201).json({
    status: 'success',
    data: {
      message: newMessage
    }
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Health check: http://localhost:${PORT}/api/health`);
}); 