const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../src/app');
const RecommendationService = require('../../src/services/recommendation.service');
const jwt = require('jsonwebtoken');
const config = require('../../src/config');

describe('Recommendation Controller', () => {
  let sandbox;
  let authToken;
  let mockUser;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    // Create mock user and token
    mockUser = {
      id: 1,
      email: 'test@example.com',
      user_type: 'job_seeker'
    };
    
    authToken = jwt.sign({ id: mockUser.id }, config.jwt.secret, { expiresIn: '1h' });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/recommendations/jobs', () => {
    it('should return job recommendations for authenticated user', async () => {
      const mockRecommendations = [
        {
          id: 1,
          title: 'Software Engineer',
          company: { name: 'TechCorp' },
          matchScore: 85
        }
      ];

      // Mock the User.findByPk for auth middleware
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getJobRecommendations')
        .resolves(mockRecommendations);

      const response = await request(app)
        .get('/api/recommendations/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 5 });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.recommendations).to.be.an('array');
      expect(response.body.data.total).to.equal(1);
      expect(response.body.data.algorithm).to.equal('skill-location-experience-based');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/recommendations/jobs');

      expect(response.status).to.equal(401);
    });

    it('should handle service errors gracefully', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getJobRecommendations')
        .rejects(new Error('Service error'));

      const response = await request(app)
        .get('/api/recommendations/jobs')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(500);
    });

    it('should respect query parameters', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      const serviceStub = sandbox.stub(RecommendationService, 'getJobRecommendations')
        .resolves([]);

      await request(app)
        .get('/api/recommendations/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          limit: 15,
          excludeApplied: 'false',
          includeScore: 'true'
        });

      expect(serviceStub.calledWith(mockUser.id, {
        limit: 15,
        excludeApplied: false
      })).to.be.true;
    });
  });

  describe('GET /api/recommendations/referrers/:jobId', () => {
    it('should return referrer recommendations for a job', async () => {
      const mockReferrers = [
        {
          id: 2,
          name: 'John Smith',
          profile: { current_company: 'TechCorp' },
          matchScore: 90
        }
      ];

      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getReferrerRecommendations')
        .resolves(mockReferrers);

      const response = await request(app)
        .get('/api/recommendations/referrers/123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.recommendations).to.be.an('array');
      expect(response.body.data.jobId).to.equal(123);
      expect(response.body.data.algorithm).to.equal('company-skill-seniority-based');
    });

    it('should validate job ID parameter', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);

      const response = await request(app)
        .get('/api/recommendations/referrers/')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });
  });

  describe('GET /api/recommendations/trending', () => {
    it('should return trending jobs', async () => {
      const mockTrendingJobs = [
        {
          id: 1,
          title: 'Popular Job',
          company: { name: 'TrendyCorp' },
          trendingScore: 10
        }
      ];

      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getTrendingJobs')
        .resolves(mockTrendingJobs.map(job => ({
          ...job,
          toJSON: () => job,
          dataValues: { referral_count: job.trendingScore }
        })));

      const response = await request(app)
        .get('/api/recommendations/trending')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 5, timeframe: 14 });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.trendingJobs).to.be.an('array');
      expect(response.body.data.timeframe).to.equal('14 days');
      expect(response.body.data.algorithm).to.equal('referral-activity-based');
    });
  });

  describe('GET /api/recommendations/feed', () => {
    it('should return personalized job feed', async () => {
      const mockRecommendations = [
        { id: 1, title: 'Recommended Job', recommendationScore: 85 }
      ];
      
      const mockTrending = [
        { 
          id: 2, 
          title: 'Trending Job',
          toJSON: () => ({ id: 2, title: 'Trending Job' }),
          dataValues: { referral_count: 5 }
        }
      ];

      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getJobRecommendations')
        .resolves(mockRecommendations);
      sandbox.stub(RecommendationService, 'getTrendingJobs')
        .resolves(mockTrending);

      const response = await request(app)
        .get('/api/recommendations/feed')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          limit: 10,
          trendingWeight: 0.4,
          recommendationWeight: 0.6
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.feed).to.be.an('array');
      expect(response.body.data.composition).to.have.property('recommended');
      expect(response.body.data.composition).to.have.property('trending');
      expect(response.body.data.algorithm).to.equal('hybrid-recommendation-trending');
    });
  });

  describe('GET /api/recommendations/insights', () => {
    it('should return recommendation insights', async () => {
      const mockInsights = {
        topSkills: ['javascript', 'react'],
        preferredLocations: ['San Francisco'],
        averageScore: 75.5,
        improvementSuggestions: ['Add more skills to your profile']
      };

      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      
      sandbox.stub(RecommendationService, 'getJobRecommendations')
        .resolves([
          {
            recommendationScore: 75.5,
            recommendationFactors: [
              { type: 'skills', details: ['javascript', 'react'] },
              { type: 'location', details: 'San Francisco' }
            ]
          }
        ]);

      const response = await request(app)
        .get('/api/recommendations/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('topSkills');
      expect(response.body.data).to.have.property('preferredLocations');
      expect(response.body.data).to.have.property('averageScore');
      expect(response.body.data).to.have.property('improvementSuggestions');
    });
  });

  describe('POST /api/recommendations/feedback/:jobId', () => {
    it('should accept valid feedback', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);

      const response = await request(app)
        .post('/api/recommendations/feedback/123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          feedback: 'helpful',
          reason: 'Great match for my skills'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.jobId).to.equal(123);
      expect(response.body.data.feedback).to.equal('helpful');
    });

    it('should reject invalid feedback values', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);

      const response = await request(app)
        .post('/api/recommendations/feedback/123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          feedback: 'invalid_feedback'
        });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.include('Invalid feedback value');
    });

    it('should accept feedback without reason', async () => {
      const User = require('../../src/models/user.model');
      sandbox.stub(User, 'findByPk').resolves(mockUser);

      const response = await request(app)
        .post('/api/recommendations/feedback/123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          feedback: 'not_interested'
        });

      expect(response.status).to.equal(200);
      expect(response.body.data.reason).to.be.null;
    });
  });
});