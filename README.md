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

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL
- Docker & Docker Compose (for development)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/awesome-referrals.git
   cd awesome-referrals
   ```

2. Install dependencies
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   ```
   # Copy the example env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Set up the database
   ```
   # Using Docker
   docker-compose up -d postgres

   # Or run migrations directly
   cd backend
   npm run migrate
   ```

5. Start the development servers
   ```
   # Backend (from the backend directory)
   npm run dev

   # Frontend (from the frontend directory)
   npm start
   ```

## 📝 Project Structure

```
awesome-referrals/
├── frontend/             # React frontend application
│   ├── public/           # Static files
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

## 📊 Project Status

The project is currently in the initial development phase. Here's what's been implemented so far:

- ✅ Project structure and architecture planning
- ✅ Environment configuration
- ✅ Database models and relationships
- ✅ Basic authentication API endpoints
- ✅ Frontend foundation with React and Material UI
- ✅ Redux store setup with authentication state management
- ✅ Home page and login UI components

### Next Steps:

- User registration and profile completion
- Job listing integration with Naukri.com
- Referral request system
- Dashboard analytics
- Messaging between referrers and seekers

See the [project plan](./project-plan.md) for the full roadmap and milestones.

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
