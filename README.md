# Awesome Referrals

A modern job referral platform that connects job seekers with employees at their target companies. The platform integrates with job listing websites like Naukri.com, provides comprehensive dashboards with analytics, and features an intuitive, community-focused UI.

## 🌟 Features

- **Job Board Integration**: Seamless integration with Naukri.com for job listings
- **Smart Referral System**: Connect job seekers with potential referrers at target companies
- **Comprehensive Dashboards**: Analytics and tracking for both job seekers and referrers
- **Verification System**: LinkedIn integration for profile verification
- **Rewards Program**: Incentives for successful referrals
- **Community Focus**: Success stories and testimonials to foster community support

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (production), SQLite (development)
- **Cloud**: AWS (EC2, S3, RDS, Lambda, SES, CloudWatch)
- **DevOps**: Docker, GitHub Actions

## 🔧 Current Technology Implementation

### Currently Implemented
- **Frontend**
  - **React.js** - Core UI framework
  - **Redux** - State management 
  - **React Router** - Navigation and routing
  - **Material UI** - Component library
  - **Formik** - Form handling and validation
  - **Yup** - Schema validation for forms
  - **Axios** - HTTP client for API requests

- **Backend**
  - **Node.js** - Runtime environment
  - **Express** - Web framework
  - **Sequelize** - ORM for database interactions
  - **SQLite** (in development) - Local database
  - **JWT** - Authentication with JSON Web Tokens
  - **bcrypt** - Password hashing and verification
  - **Winston** - Logging framework

- **Development Tools**
  - **nodemon** - For automatic server restarts during development

### Planned for Future Phases
- **PostgreSQL** - Production database (replacing SQLite)
- **Redis** - For caching and session management
- **LinkedIn OAuth** - For user verification
- **Docker** - For containerization
- **AWS Services** - For production deployment
  - S3 for file storage
  - EC2 for hosting
  - RDS for database
  - CloudWatch for monitoring

## 📊 Project Status

The project has completed Phase 1 (Foundation) and is currently in Phase 2 (Core Functionality), with approximately 85% of Phase 2 completed. Here's what's been implemented:

### Backend
- Express server with production-ready configuration
- Database models and relationships
- Authentication system with JWT
- Real user lookup in authentication middleware
- User management API endpoints
- Job API with advanced search and filtering
- Referral management endpoints
- Company endpoints
- Messaging system backend
- Notification system endpoints
- Analytics and statistics endpoints
- Error handling and logging
- API rate limiting for security
- Health check endpoints
- External job API integration with Naukri.com and LinkedIn
- LinkedIn OAuth integration for authentication and profile verification

### Frontend
- React application with Redux state management
- Centralized API service for consistent backend communication
- Standardized action creators with consistent error handling patterns
- User authentication flow (login, register, LinkedIn authentication)
- Job search and details pages
- Company search and details pages
- User dashboard with analytics
- Referral request management
- User profile management
- Messaging interface
- Notifications system
- Protected routes for authenticated users
- LinkedIn integration for user verification

### In Progress
- Enhanced analytics dashboards
- Recommendation engine implementation

See the [project plan](./project-plan.md) for detailed information about the roadmap and future milestones.

## 📈 Development Progress Tracking

| Feature                          | Status      | Phase  | Notes                                      |
|----------------------------------|-------------|--------|-------------------------------------------|
| Basic Authentication             | ✅ Complete | 1      | Login, registration, and token management |
| Database Models                  | ✅ Complete | 1      | All core models implemented               |
| Frontend Pages                   | ✅ Complete | 1      | All basic pages implemented               |
| API Integration                  | ✅ Complete | 1      | Centralized API service                   |
| Job Search & Filters             | ✅ Complete | 2      | Advanced search with multiple filters     |
| Save Jobs Functionality          | ✅ Complete | 2      | Users can save jobs for later             |
| Referral System                  | ✅ Complete | 2      | Core functionality implemented            |
| Messaging System                 | ✅ Complete | 2      | Basic messaging functionality implemented |
| Real User Lookup in Auth         | ✅ Complete | 2      | Backend now fetches user from DB          |
| Centralized Redux Actions        | ✅ Complete | 2      | Consistent error handling & return patterns |
| Notification System              | ✅ Complete | 2      | Basic notification infrastructure          |
| Analytics Endpoints              | ✅ Complete | 2      | Backend stats endpoints implemented       |
| LinkedIn Verification            | ✅ Complete | 2      | OAuth integration for authentication      |
| Enhanced Analytics Dashboard     | 🔄 In Progress | 2   | Advanced visualizations under development |
| External Job API Integration     | ✅ Complete | 2      | Integration with Naukri.com and LinkedIn   |
| Admin Features                   | ⏳ Pending   | 3     | Not started                               |
| Performance Optimizations        | ⏳ Pending   | 4     | Not started                               |

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ and npm
- PostgreSQL database (for production)
- Docker and Docker Compose (optional, for containerized setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/awesome-referrals.git
cd awesome-referrals
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`
   - Set up your database connection and JWT secret

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm start
```

### Using Docker

You can also use Docker to run the entire application:

```bash
docker-compose up
```

Visit http://localhost:3000 to access the application.

## 📝 Project Structure

```
awesome-referrals/
├── frontend/             # React frontend application
│   ├── public/           # Static files
│   ├── src/              # Source files
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and actions
│   │   ├── services/     # API and other services
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.js        # Main App component
│   └── package.json      # Frontend dependencies
│
├── backend/              # Node.js backend application
│   ├── src/              # Source code
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Server startup
│   └── package.json      # Backend dependencies
│
├── docker-compose.yml    # Docker configuration
├── project-plan.md       # Detailed project plan
└── README.md             # Project documentation
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/your-username/awesome-referrals](https://github.com/your-username/awesome-referrals)
