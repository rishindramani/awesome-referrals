// Mock API service to simulate backend responses
import axios from 'axios';

// Base API URL - would come from env in real app
const API_URL = 'http://localhost:5000/api';

// Sample mock data
const mockUsers = [
  {
    id: 1,
    email: 'user@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: 'job_seeker',
    createdAt: '2023-01-15T10:30:00Z',
    profile: {
      current_title: 'Software Engineer',
      experience_years: 3,
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'Passionate developer looking for new opportunities',
      linkedin_url: 'https://linkedin.com/in/testuser'
    }
  }
];

const mockCompanies = [
  {
    id: 1,
    name: 'Google',
    logo_url: 'https://logo.clearbit.com/google.com',
    location: 'Mountain View, CA',
    industry: 'Technology',
    website: 'https://google.com',
    description: 'Google is a multinational technology company specializing in Internet-related services and products.',
    size: '10,000+ employees',
    founded: '1998'
  },
  {
    id: 2,
    name: 'Microsoft',
    logo_url: 'https://logo.clearbit.com/microsoft.com',
    location: 'Redmond, WA',
    industry: 'Technology',
    website: 'https://microsoft.com',
    description: 'Microsoft is an American multinational technology corporation that produces computer software, consumer electronics, and related services.',
    size: '10,000+ employees',
    founded: '1975'
  },
  {
    id: 3,
    name: 'Amazon',
    logo_url: 'https://logo.clearbit.com/amazon.com',
    location: 'Seattle, WA',
    industry: 'E-commerce, Cloud Computing',
    website: 'https://amazon.com',
    description: 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    size: '10,000+ employees',
    founded: '1994'
  }
];

const mockJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company_id: 1,
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    description: 'We are looking for a senior software engineer to join our team...',
    requirements: 'At least 5 years of experience in web development...',
    salary_range: '$150,000 - $180,000',
    posted_date: '2023-10-01T00:00:00Z',
    status: 'open'
  },
  {
    id: 2,
    title: 'Product Manager',
    company_id: 2,
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Full-time',
    description: 'As a product manager, you will be responsible for...',
    requirements: 'Strong experience in product management...',
    salary_range: '$130,000 - $160,000',
    posted_date: '2023-10-05T00:00:00Z',
    status: 'open'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company_id: 3,
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Full-time',
    description: 'Join our data science team to analyze and derive insights...',
    requirements: 'MS or PhD in Computer Science, Statistics, or related field...',
    salary_range: '$140,000 - $170,000',
    posted_date: '2023-10-10T00:00:00Z',
    status: 'open'
  }
];

const mockReferrals = [
  {
    id: 1,
    job_id: 1,
    seeker_id: 1,
    referrer_id: 2,
    status: 'pending',
    message: 'I believe I would be a great fit for this role...',
    created_at: '2023-10-15T00:00:00Z',
    job: {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google'
    },
    seeker: {
      id: 1,
      first_name: 'Test',
      last_name: 'User'
    },
    referrer: {
      id: 2,
      first_name: 'Jane',
      last_name: 'Doe'
    }
  }
];

// Mock delay to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a mock axios instance with interceptors
const mockAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
mockAPI.interceptors.request.use(
  async config => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor with mock implementation
mockAPI.interceptors.response.use(
  response => response,
  async error => {
    // If real API exists and responds, use that response
    if (error.response) {
      return Promise.reject(error);
    }
    
    // Otherwise, handle with mock data
    const { url, method, data, params } = error.config;
    
    // Simulate network delay
    await delay(500);
    
    // Mock authentication
    if (url.includes('/auth/login')) {
      const requestData = JSON.parse(data);
      if (requestData.email === 'user@example.com' && requestData.password === 'password') {
        return {
          data: {
            token: 'mock-jwt-token',
            user: mockUsers[0]
          }
        };
      } else {
        return Promise.reject({
          response: {
            status: 401,
            data: { message: 'Invalid credentials' }
          }
        });
      }
    }
    
    // Mock company endpoints
    if (url.includes('/companies')) {
      if (url.includes('/companies/search')) {
        const query = params?.q || '';
        const filteredCompanies = mockCompanies.filter(company => 
          company.name.toLowerCase().includes(query.toLowerCase()) ||
          company.industry.toLowerCase().includes(query.toLowerCase())
        );
        return {
          data: {
            companies: filteredCompanies,
            pagination: {
              page: 1,
              limit: 10,
              totalItems: filteredCompanies.length,
              totalPages: 1
            }
          }
        };
      } else if (url.match(/\/companies\/\d+$/)) {
        const id = parseInt(url.split('/').pop());
        const company = mockCompanies.find(c => c.id === id);
        
        if (company) {
          return {
            data: company
          };
        } else {
          return Promise.reject({
            response: {
              status: 404,
              data: { message: 'Company not found' }
            }
          });
        }
      } else {
        // Return all companies
        return {
          data: {
            companies: mockCompanies,
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 10,
              totalItems: mockCompanies.length,
              totalPages: 1
            }
          }
        };
      }
    }
    
    // Mock job endpoints
    if (url.includes('/jobs')) {
      if (url.includes('/jobs/search')) {
        const query = params?.q || '';
        const filteredJobs = mockJobs.filter(job => 
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase())
        );
        return {
          data: {
            jobs: filteredJobs,
            pagination: {
              page: 1,
              limit: 10,
              totalItems: filteredJobs.length,
              totalPages: 1
            }
          }
        };
      } else if (url.match(/\/jobs\/\d+$/)) {
        const id = parseInt(url.split('/').pop());
        const job = mockJobs.find(j => j.id === id);
        
        if (job) {
          return {
            data: job
          };
        } else {
          return Promise.reject({
            response: {
              status: 404,
              data: { message: 'Job not found' }
            }
          });
        }
      } else {
        // Return all jobs
        return {
          data: {
            jobs: mockJobs,
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 10,
              totalItems: mockJobs.length,
              totalPages: 1
            }
          }
        };
      }
    }
    
    // Mock referral endpoints
    if (url.includes('/referrals')) {
      if (url.match(/\/referrals\/\d+$/)) {
        const id = parseInt(url.split('/').pop());
        const referral = mockReferrals.find(r => r.id === id);
        
        if (referral) {
          return {
            data: referral
          };
        } else {
          return Promise.reject({
            response: {
              status: 404,
              data: { message: 'Referral not found' }
            }
          });
        }
      } else {
        // Return all referrals
        return {
          data: {
            referrals: mockReferrals,
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 10,
              totalItems: mockReferrals.length,
              totalPages: 1
            }
          }
        };
      }
    }
    
    // If no mock handler is defined, reject with a generic error
    return Promise.reject({
      response: {
        status: 500,
        data: { message: 'Mock API error: No handler defined for this request' }
      }
    });
  }
);

export default mockAPI; 