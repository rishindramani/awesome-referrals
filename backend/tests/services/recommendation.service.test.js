const { expect } = require('chai');
const sinon = require('sinon');
const RecommendationService = require('../../src/services/recommendation.service');
const { Job, User, Company, ReferralRequest, UserProfile, SavedJob } = require('../../src/models');

describe('RecommendationService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getJobRecommendations', () => {
    it('should return job recommendations for a user', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        profile: {
          skills: ['javascript', 'react', 'node.js'],
          location: 'San Francisco',
          experience_years: 3
        },
        savedJobs: []
      };

      const mockJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          skills: ['javascript', 'react'],
          location: 'San Francisco',
          experience_level: 'mid',
          company: { name: 'TechCorp', industry: 'Software' },
          created_at: new Date(),
          toJSON: () => ({ id: 1, title: 'Frontend Developer' })
        }
      ];

      const mockReferrals = [];

      // Set up stubs
      sandbox.stub(User, 'findByPk').resolves(mockUser);
      sandbox.stub(ReferralRequest, 'findAll').resolves(mockReferrals);
      sandbox.stub(Job, 'findAll').resolves(mockJobs);

      const result = await RecommendationService.getJobRecommendations(1, { limit: 10 });

      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
      expect(result[0]).to.have.property('recommendationScore');
      expect(result[0]).to.have.property('recommendationFactors');
    });

    it('should handle user not found', async () => {
      sandbox.stub(User, 'findByPk').resolves(null);

      try {
        await RecommendationService.getJobRecommendations(999);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('User not found');
      }
    });

    it('should exclude applied and saved jobs when requested', async () => {
      const mockUser = {
        id: 1,
        profile: { skills: ['javascript'] },
        savedJobs: [{ id: 2 }]
      };

      const mockReferrals = [
        { job_id: 1, job: { id: 1, company: { name: 'TestCorp' } } }
      ];

      sandbox.stub(User, 'findByPk').resolves(mockUser);
      sandbox.stub(ReferralRequest, 'findAll').resolves(mockReferrals);
      
      const jobFindAllStub = sandbox.stub(Job, 'findAll');
      jobFindAllStub.resolves([]);

      await RecommendationService.getJobRecommendations(1, { excludeApplied: true });

      const whereConditions = jobFindAllStub.getCall(0).args[0].where;
      expect(whereConditions.id.$notIn).to.include(1); // Applied job
      expect(whereConditions.id.$notIn).to.include(2); // Saved job
    });
  });

  describe('getReferrerRecommendations', () => {
    it('should return referrer recommendations for a job', async () => {
      const mockJob = {
        id: 1,
        title: 'Software Engineer',
        skills: ['python', 'django'],
        company: { name: 'TechCorp', industry: 'Software' }
      };

      const mockReferrers = [
        {
          id: 2,
          user_type: 'referrer',
          profile: {
            current_company: 'TechCorp',
            skills: ['python', 'django', 'aws'],
            seniority_level: 'senior'
          },
          toJSON: () => ({ id: 2, name: 'John Doe' })
        }
      ];

      sandbox.stub(Job, 'findByPk').resolves(mockJob);
      sandbox.stub(User, 'findAll').resolves(mockReferrers);

      const result = await RecommendationService.getReferrerRecommendations(1, 3, { limit: 5 });

      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
      expect(result[0]).to.have.property('recommendationScore');
      expect(result[0]).to.have.property('recommendationFactors');
    });

    it('should handle job not found', async () => {
      sandbox.stub(Job, 'findByPk').resolves(null);

      try {
        await RecommendationService.getReferrerRecommendations(999, 1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Job not found');
      }
    });
  });

  describe('getTrendingJobs', () => {
    it('should return trending jobs based on referral activity', async () => {
      const mockTrendingJobs = [
        {
          id: 1,
          title: 'Popular Job',
          company: { name: 'TrendyCorp' },
          dataValues: { referral_count: 5 }
        }
      ];

      sandbox.stub(Job, 'findAll').resolves(mockTrendingJobs);

      const result = await RecommendationService.getTrendingJobs({ limit: 10, timeframe: 7 });

      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
    });
  });

  describe('extractUserSkills', () => {
    it('should extract skills from user profile and referral history', () => {
      const user = {
        profile: {
          skills: ['javascript', 'react']
        }
      };

      const referrals = [
        {
          job: {
            skills: ['node.js', 'mongodb']
          }
        }
      ];

      const skills = RecommendationService.extractUserSkills(user, referrals);

      expect(skills).to.include('javascript');
      expect(skills).to.include('react');
      expect(skills).to.include('node.js');
      expect(skills).to.include('mongodb');
    });

    it('should handle comma-separated skills string', () => {
      const user = {
        profile: {
          skills: 'python, django, flask'
        }
      };

      const skills = RecommendationService.extractUserSkills(user, []);

      expect(skills).to.include('python');
      expect(skills).to.include('django');
      expect(skills).to.include('flask');
    });

    it('should return empty array when no skills found', () => {
      const user = { profile: {} };
      const skills = RecommendationService.extractUserSkills(user, []);

      expect(skills).to.be.an('array').that.is.empty;
    });
  });

  describe('scoreJobs', () => {
    it('should score jobs based on skill matching', () => {
      const jobs = [
        {
          id: 1,
          skills: ['javascript', 'react'],
          location: 'San Francisco',
          experience_level: 'mid',
          company: { name: 'TechCorp' },
          created_at: new Date(),
          toJSON: () => ({ id: 1, title: 'Frontend Developer' })
        }
      ];

      const userContext = {
        userSkills: ['javascript', 'react', 'node.js'],
        preferredLocations: ['san francisco'],
        preferredCompanies: [],
        userProfile: { experience_years: 3 }
      };

      const scoredJobs = RecommendationService.scoreJobs(jobs, userContext);

      expect(scoredJobs).to.be.an('array');
      expect(scoredJobs[0]).to.have.property('recommendationScore');
      expect(scoredJobs[0].recommendationScore).to.be.above(0);
      expect(scoredJobs[0]).to.have.property('recommendationFactors');
    });
  });

  describe('calculateExperienceScore', () => {
    it('should return perfect score for exact experience match', () => {
      const score = RecommendationService.calculateExperienceScore('mid', 4);
      expect(score).to.equal(1);
    });

    it('should penalize under-qualified candidates', () => {
      const score = RecommendationService.calculateExperienceScore('senior', 2);
      expect(score).to.be.below(1);
      expect(score).to.be.above(0);
    });

    it('should slightly penalize over-qualified candidates', () => {
      const score = RecommendationService.calculateExperienceScore('junior', 10);
      expect(score).to.be.below(1);
      expect(score).to.be.at.least(0.3);
    });

    it('should return default score for unknown levels', () => {
      const score = RecommendationService.calculateExperienceScore('unknown', 5);
      expect(score).to.equal(0.5);
    });
  });

  describe('calculateSeniorityScore', () => {
    it('should return correct scores for different seniority levels', () => {
      expect(RecommendationService.calculateSeniorityScore('intern')).to.equal(0.2);
      expect(RecommendationService.calculateSeniorityScore('junior')).to.equal(0.4);
      expect(RecommendationService.calculateSeniorityScore('senior')).to.equal(0.8);
      expect(RecommendationService.calculateSeniorityScore('principal')).to.equal(1);
    });

    it('should return default score for unknown seniority', () => {
      const score = RecommendationService.calculateSeniorityScore('unknown');
      expect(score).to.equal(0.5);
    });
  });

  describe('scoreReferrers', () => {
    it('should score referrers based on company match and skills', () => {
      const referrers = [
        {
          id: 1,
          profile: {
            current_company: 'TechCorp',
            skills: ['python', 'django'],
            seniority_level: 'senior'
          },
          toJSON: () => ({ id: 1, name: 'Jane Smith' })
        }
      ];

      const job = {
        company: { name: 'TechCorp' },
        skills: ['python', 'flask']
      };

      const scoredReferrers = RecommendationService.scoreReferrers(referrers, job, 1);

      expect(scoredReferrers).to.be.an('array');
      expect(scoredReferrers[0]).to.have.property('recommendationScore');
      expect(scoredReferrers[0].recommendationScore).to.be.above(50); // Should get company match score
      expect(scoredReferrers[0]).to.have.property('recommendationFactors');
    });
  });
});