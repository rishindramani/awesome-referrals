# Awesome Referrals - Project Plan

## Project Overview
Awesome Referrals is a platform connecting job seekers with employees at target companies who can provide internal referrals. The platform aims to increase the chances of getting interviews by leveraging personal connections and streamlining the referral process.

## Tech Stack

- **Frontend**: React, Redux, Material UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, LinkedIn OAuth
- **Deployment**: Docker, AWS

## Project Structure

```
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── app.js           # Main Express app
│   ├── tests/               # Backend tests
│   └── package.json         # Backend dependencies
│
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main React app
│   │   └── index.js         # Entry point
│   ├── tests/               # Frontend tests
│   └── package.json         # Frontend dependencies
│
├── docker-compose.yml       # Docker configuration
└── README.md                # Project documentation
```

## Phase 1: Foundation (Completed)

### Backend Development

- ✅ Setup Express server with basic configuration
- ✅ Database schema design and implementation
- ✅ Create models for User, Company, Job, UserProfile, and ReferralRequest
- ✅ Authentication controllers and middleware
- ✅ Basic API endpoints for authentication and user management

### Frontend Development

- ✅ Setup React application with Redux
- ✅ Implement Redux store with auth, UI, and job reducers
- ✅ Create authentication-related components
- ✅ Design and implement common layout components
- ✅ Build essential UI components (alerts, loaders, etc.)
- ✅ Develop basic pages:
  - ✅ Home page
  - ✅ Login page
  - ✅ Registration page
  - ✅ Dashboard
  - ✅ Job Search
  - ✅ Job Detail
  - ✅ Referral Requests
  - ✅ User Profile

## Phase 2: Core Functionality (In Progress)

### Backend Development

- [x] Real user lookup in auth middleware (backend now fetches user from DB after JWT verification, replacing mock user)
- [ ] Implement job listing API with search and filters
- [ ] Create endpoints for referral requests
- [ ] Develop user profile management
- [ ] Build notification system
- [ ] Integrate with external job APIs (e.g., Naukri.com)

### Frontend Development

- [ ] Implement job browsing and search functionality
- [ ] Create referral request workflow
- [ ] Build messaging system between referrers and seekers
- [ ] Complete user profile management
- [ ] Develop analytics dashboard

## Phase 3: Enhanced Features

### Backend Development

- [ ] LinkedIn integration for verification
- [ ] Resume parsing and job matching algorithms
- [ ] Advanced analytics for job application tracking
- [ ] Recommendation engine
- [ ] Admin dashboard and moderation tools

### Frontend Development

- [ ] Company profiles and reviews
- [ ] Advanced filtering and recommendation UI
- [ ] Mobile responsiveness improvements
- [ ] Advanced analytics visualization
- [ ] Admin interface

## Phase 4: Polishing and Scaling

### Backend Development

- [ ] Performance optimizations
- [ ] Caching strategies
- [ ] Rate limiting and security enhancements
- [ ] Database scaling solutions
- [ ] Automated testing

### Frontend Development

- [ ] Performance optimizations
- [ ] Progressive Web App (PWA) features
- [ ] Accessibility improvements
- [ ] UI/UX refinements
- [ ] Comprehensive testing

## Timeline

- **Phase 1 (Foundation)**: Completed
- **Phase 2 (Core Functionality)**: Current focus
- **Phase 3 (Enhanced Features)**: Planned after Phase 2 completion
- **Phase 4 (Polishing and Scaling)**: Final phase

## Key Milestones

1. ✅ MVP with basic authentication and user profiles
2. ✅ Job search and details implementation
3. ✅ Referral request system basic functionality
4. [ ] Complete messaging system
5. [ ] LinkedIn integration
6. [ ] Analytics and recommendation engine
7. [ ] Admin dashboard and moderation tools
8. [ ] Mobile-optimized version
9. [ ] Production deployment with scaling

## Challenges and Solutions

### Challenges

1. **Data Integrity**: Ensuring accurate job listings and user profiles
   - Solution: Implement verification processes and regular data cleaning

2. **User Trust**: Building trust between job seekers and referrers
   - Solution: LinkedIn verification, review system, and transparent profiles

3. **Scaling**: Handling increased traffic as the platform grows
   - Solution: Implement caching, pagination, and database indexing strategies

4. **Engagement**: Keeping users engaged on the platform
   - Solution: Notification system, personalized recommendations, and analytics

## Future Considerations

- Mobile app development (React Native)
- AI-powered job matching
- Premium features and subscription model
- Expansion to additional markets
- Integration with ATS (Applicant Tracking Systems)

## Technical Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux
- **UI Components**: Material-UI
- **Routing**: React Router
- **Form Handling**: Formik with Yup validation
- **API Calls**: Axios
- **Testing**: Jest, React Testing Library

### Backend
- **Framework**: Node.js with Express.js
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Testing**: Mocha, Chai

### Database
- **Primary Database**: PostgreSQL
- **ORM**: Sequelize
- **Caching**: Redis (for session management, rate limiting)

### Cloud Services (AWS)
- **Hosting**: EC2 or Elastic Beanstalk
- **Storage**: S3 (for profile pictures, resumes)
- **CDN**: CloudFront
- **Database**: RDS (PostgreSQL)
- **Serverless**: Lambda (for scheduled tasks, notifications)
- **Email Service**: SES
- **Monitoring**: CloudWatch
- **CI/CD**: GitHub Actions with AWS CodeDeploy

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev), ECS or Kubernetes (prod)
- **Version Control**: Git/GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, AWS CloudWatch
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Database Schema (Key Entities)

### Users
- id (PK)
- email
- password_hash
- user_type (job_seeker, referrer, admin)
- first_name
- last_name
- profile_picture_url
- linkedin_url
- verified (boolean)
- verification_method
- created_at
- updated_at

### Companies
- id (PK)
- name
- logo_url
- website
- industry
- description
- created_at
- updated_at

### Jobs
- id (PK)
- source_id (ID from Naukri or other platforms)
- source_platform (e.g., "naukri")
- title
- company_id (FK to Companies)
- description
- requirements
- location
- job_type (full-time, part-time, contract)
- experience_level
- salary_range
- application_url
- posted_date
- created_at
- updated_at

### UserProfiles
- id (PK)
- user_id (FK to Users)
- current_company_id (FK to Companies)
- current_position
- experience_years
- skills (array)
- resume_url
- bio
- referral_count
- success_rate
- created_at
- updated_at

### ReferralRequests
- id (PK)
- job_id (FK to Jobs)
- seeker_id (FK to Users)
- referrer_id (FK to Users)
- status (pending, accepted, declined, interview_scheduled, hired, closed)
- message
- resume_url
- created_at
- updated_at
- completed_at

### Notifications
- id (PK)
- user_id (FK to Users)
- type
- message
- related_entity_id
- related_entity_type
- read (boolean)
- created_at

### RewardPoints
- id (PK)
- user_id (FK to Users)
- points
- reason
- referral_request_id (FK to ReferralRequests)
- created_at

### Rewards
- id (PK)
- name
- description
- points_required
- image_url
- active (boolean)
- created_at
- updated_at

## Development Phases

### Phase 1: Setup and MVP (4 Weeks)

#### Week 1-2: Project Setup and Authentication
- Set up project repository and development environment
- Create basic project structure (frontend and backend)
- Implement user authentication (register, login, forgot password)
- Develop basic user profiles
- Set up database and ORM
- Implement LinkedIn integration for verification

#### Week 3-4: Job Integration and Basic Referral System
- Implement Naukri.com API integration
- Develop job search and filtering functionality
- Create basic job detail pages
- Implement simple referral request system
- Develop notification system skeleton
- Set up basic email notifications

### Phase 2: Core Features (6 Weeks)

#### Week 5-6: Enhanced Referral System
- Implement complete referral workflow (request, accept, decline)
- Develop referral tracking system
- Enhance notifications (in-app and email)
- Create basic dashboard for job seekers
- Implement basic dashboard for referrers

#### Week 7-8: Incentive System and Profile Enhancement
- Develop rewards and points system
- Implement badges and recognition features
- Enhance user profiles with more detailed information
- Add resume upload and management
- Implement profile completeness indicators

#### Week 9-10: Dashboard Enhancement and Analytics
- Develop comprehensive dashboard for job seekers
- Implement analytics for referral success rates
- Create visualization for application status
- Develop referrer dashboard with performance metrics
- Implement admin dashboard for platform oversight

### Phase 3: Advanced Features and Optimization (4 Weeks)

#### Week 11-12: Advanced Features
- Implement advanced matching algorithm for referrers and job seekers
- Develop community features (success stories, testimonials)
- Add recommendation engine for jobs
- Implement chat/messaging between referrers and job seekers
- Enhance search with filters and saved searches

#### Week 13-14: UI/UX Refinement and Performance
- Conduct usability testing and gather feedback
- Refine UI/UX based on feedback
- Optimize application performance
- Implement responsive design improvements
- Ensure accessibility compliance (WCAG standards)

### Phase 4: Testing and Deployment (2 Weeks)

#### Week 15: Testing
- Conduct comprehensive testing (unit, integration, system)
- Perform security audit and penetration testing
- Conduct load and performance testing
- User acceptance testing
- Fix bugs and issues identified during testing

#### Week 16: Deployment and Monitoring
- Finalize deployment pipeline
- Deploy to staging environment
- Conduct final checks and testing
- Deploy to production environment
- Set up monitoring and logging
- Implement backup and disaster recovery protocols

## Security Plan

### Authentication and Authorization
- JWT-based authentication with short-lived tokens
- Refresh token rotation
- Role-based access control
- Session management with Redis
- OAuth integration for social logins

### Data Protection
- HTTPS with TLS 1.3
- Data encryption at rest (database) and in transit
- Secure storage of sensitive information using AWS Secrets Manager
- Regular security audits and vulnerability scans

### API Security
- Rate limiting to prevent abuse
- Input validation and sanitization
- Protection against common attacks (CSRF, XSS, SQL Injection)
- API authentication and authorization

### Compliance
- GDPR compliance for European users
- CCPA compliance for California residents
- Privacy policy and terms of service
- Data retention policies
- User consent management

## Monitoring and Maintenance

### Performance Monitoring
- Real-time application monitoring with CloudWatch and Prometheus
- Database performance monitoring
- API endpoint response time tracking
- Frontend performance metrics

### Error Tracking
- Centralized error logging with the ELK Stack
- Real-time error notifications
- User-reported issue tracking

### Maintenance Schedule
- Weekly dependency updates
- Monthly security patches
- Quarterly feature updates
- Bi-annual major version releases

## Scaling Strategy

### Horizontal Scaling
- Auto-scaling groups for application servers
- Read replicas for database
- Stateless application design
- Load balancing

### Vertical Scaling
- Resource optimization
- Database optimization
- Caching strategy
- CDN for static assets

## User Acquisition Strategy

### Marketing Channels
- LinkedIn campaigns targeting both job seekers and potential referrers
- Partnerships with career counseling services
- Campus ambassadors for university outreach
- Content marketing focusing on job search success stories
- SEO optimization for job search related keywords

### Retention Strategy
- Gamification elements through the rewards system
- Regular email digests with new matching opportunities
- Success metrics and testimonials
- Continuous feature improvement based on user feedback

### Growth Metrics
- User registration and activation rates
- Referral request volume
- Referral acceptance rate
- Interview conversion rate
- Hire conversion rate
- User retention and engagement

## Deliverables

### Documentation
- Technical specification
- API documentation
- Database schema
- System architecture diagrams
- User guides (for job seekers, referrers, and admins)

### Code
- Version-controlled source code
- Automated tests
- CI/CD pipeline configuration
- Deployment scripts

### Design Assets
- UI/UX wireframes and prototypes
- Style guide
- Component library

## Risk Management

### Identified Risks
1. **API Integration Limitations**: Naukri.com might have API restrictions or changes
   - Mitigation: Develop fallback mechanisms and alternative data sources
   
2. **User Adoption**: Achieving critical mass of referrers
   - Mitigation: Targeted marketing and enhanced incentive system
   
3. **Data Privacy Concerns**: Handling sensitive user information
   - Mitigation: Robust security measures and transparent privacy policies
   
4. **Scalability Issues**: Managing rapid growth
   - Mitigation: Cloud-based elastic infrastructure

### Contingency Plans
- Alternative data sources if primary API fails
- Progressive feature rollout to manage load
- Regular database backups and disaster recovery testing

## Future Roadmap (Post-Launch)

### Expansion
- Integration with additional job boards (LinkedIn, Indeed)
- Mobile applications (iOS and Android)
- International market adaptation

### Advanced Features
- AI-driven matching and recommendations
- Video interview platform integration
- Career progression tracking
- Learning resources and upskilling recommendations

### Monetization Strategy
- Premium features for job seekers
- Recruitment solutions for companies
- Sponsored job listings
- Enterprise referral management system for large companies 