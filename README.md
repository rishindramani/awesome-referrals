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
- **Database**: PostgreSQL
- **Cloud**: AWS (EC2, S3, RDS, Lambda, SES, CloudWatch)
- **DevOps**: Docker, GitHub Actions

## 📊 Project Status

The project has completed Phase 1 (Foundation) and is currently in Phase 2 (Core Functionality). Here's what's been implemented:

### Backend
- Express server with configuration
- Database models and relationships
- Authentication system with JWT
- User management API endpoints

### Frontend
- React application with Redux state management
- User authentication flow (login, register)
- Job search and details pages
- User dashboard with analytics
- Referral request management
- User profile management

See the [project plan](./project-plan.md) for detailed information about the roadmap and future milestones.

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ and npm
- PostgreSQL database
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

4. Run the database migrations:
```bash
cd backend
npx sequelize-cli db:migrate
```

5. Start the development servers:

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
│   │   └── app.js        # Express app setup
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
