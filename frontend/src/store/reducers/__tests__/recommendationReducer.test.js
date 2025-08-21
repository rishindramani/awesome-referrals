import recommendationReducer from '../recommendationReducer';
import {
  RECOMMENDATION_LOADING,
  RECOMMENDATION_ERROR,
  SET_JOB_RECOMMENDATIONS,
  SET_REFERRER_RECOMMENDATIONS,
  SET_TRENDING_JOBS,
  SET_PERSONALIZED_FEED,
  SET_RECOMMENDATION_INSIGHTS,
  CLEAR_RECOMMENDATIONS
} from '../../actions/recommendationActions';

describe('recommendationReducer', () => {
  const initialState = {
    loading: false,
    error: null,
    jobRecommendations: {
      recommendations: [],
      total: 0,
      algorithm: null
    },
    referrerRecommendations: {
      recommendations: [],
      total: 0,
      jobId: null,
      algorithm: null
    },
    trendingJobs: {
      trendingJobs: [],
      total: 0,
      timeframe: null,
      algorithm: null
    },
    personalizedFeed: {
      feed: [],
      total: 0,
      composition: {},
      algorithm: null
    },
    insights: {
      topSkills: [],
      preferredLocations: [],
      averageScore: 0,
      improvementSuggestions: []
    },
    lastUpdated: null
  };

  it('should return the initial state', () => {
    expect(recommendationReducer(undefined, {})).toEqual(initialState);
  });

  describe('RECOMMENDATION_LOADING', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error'
      };

      const action = { type: RECOMMENDATION_LOADING };
      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBe(null);
    });
  });

  describe('RECOMMENDATION_ERROR', () => {
    it('should set error and stop loading', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const errorMessage = 'Failed to load recommendations';
      const action = {
        type: RECOMMENDATION_ERROR,
        payload: errorMessage
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('SET_JOB_RECOMMENDATIONS', () => {
    it('should set job recommendations and update lastUpdated', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const recommendationsData = {
        recommendations: [
          {
            id: 1,
            title: 'Software Engineer',
            company: { name: 'TechCorp' },
            matchScore: 85
          }
        ],
        total: 1,
        algorithm: 'skill-location-experience-based'
      };

      const action = {
        type: SET_JOB_RECOMMENDATIONS,
        payload: recommendationsData
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.jobRecommendations).toEqual(recommendationsData);
      expect(newState.lastUpdated).toBeTruthy();
      expect(new Date(newState.lastUpdated)).toBeInstanceOf(Date);
    });
  });

  describe('SET_REFERRER_RECOMMENDATIONS', () => {
    it('should set referrer recommendations with jobId', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const referrerData = {
        jobId: 123,
        recommendations: [
          {
            id: 2,
            name: 'John Smith',
            profile: { current_company: 'TechCorp' },
            matchScore: 90
          }
        ],
        total: 1,
        algorithm: 'company-skill-seniority-based'
      };

      const action = {
        type: SET_REFERRER_RECOMMENDATIONS,
        payload: referrerData
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.referrerRecommendations).toEqual(referrerData);
      expect(newState.referrerRecommendations.jobId).toBe(123);
      expect(newState.lastUpdated).toBeTruthy();
    });
  });

  describe('SET_TRENDING_JOBS', () => {
    it('should set trending jobs data', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const trendingData = {
        trendingJobs: [
          {
            id: 1,
            title: 'Popular Job',
            company: { name: 'TrendyCorp' },
            trendingScore: 10
          }
        ],
        total: 1,
        timeframe: '7 days',
        algorithm: 'referral-activity-based'
      };

      const action = {
        type: SET_TRENDING_JOBS,
        payload: trendingData
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.trendingJobs).toEqual(trendingData);
      expect(newState.lastUpdated).toBeTruthy();
    });
  });

  describe('SET_PERSONALIZED_FEED', () => {
    it('should set personalized feed data', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const feedData = {
        feed: [
          {
            id: 1,
            title: 'Recommended Job',
            feedType: 'recommended',
            feedReason: 'Based on your profile and activity'
          },
          {
            id: 2,
            title: 'Trending Job',
            feedType: 'trending',
            feedReason: 'Popular among job seekers'
          }
        ],
        total: 2,
        composition: {
          recommended: 1,
          trending: 1
        },
        algorithm: 'hybrid-recommendation-trending'
      };

      const action = {
        type: SET_PERSONALIZED_FEED,
        payload: feedData
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.personalizedFeed).toEqual(feedData);
      expect(newState.personalizedFeed.composition.recommended).toBe(1);
      expect(newState.personalizedFeed.composition.trending).toBe(1);
      expect(newState.lastUpdated).toBeTruthy();
    });
  });

  describe('SET_RECOMMENDATION_INSIGHTS', () => {
    it('should set recommendation insights', () => {
      const previousState = {
        ...initialState,
        loading: true
      };

      const insightsData = {
        topSkills: ['javascript', 'react', 'node.js'],
        preferredLocations: ['San Francisco', 'New York'],
        averageScore: 75.5,
        improvementSuggestions: [
          'Add more skills to your profile',
          'Complete your work experience section'
        ]
      };

      const action = {
        type: SET_RECOMMENDATION_INSIGHTS,
        payload: insightsData
      };

      const newState = recommendationReducer(previousState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.insights).toEqual(insightsData);
      expect(newState.insights.topSkills).toHaveLength(3);
      expect(newState.insights.averageScore).toBe(75.5);
      expect(newState.lastUpdated).toBeTruthy();
    });
  });

  describe('CLEAR_RECOMMENDATIONS', () => {
    it('should reset state to initial state', () => {
      const previousState = {
        loading: false,
        error: 'Some error',
        jobRecommendations: {
          recommendations: [{ id: 1, title: 'Job' }],
          total: 1,
          algorithm: 'test'
        },
        referrerRecommendations: {
          recommendations: [{ id: 2, name: 'Person' }],
          total: 1,
          jobId: 123,
          algorithm: 'test'
        },
        trendingJobs: {
          trendingJobs: [{ id: 3, title: 'Trending' }],
          total: 1,
          timeframe: '7 days',
          algorithm: 'test'
        },
        personalizedFeed: {
          feed: [{ id: 4, title: 'Feed Item' }],
          total: 1,
          composition: { recommended: 1 },
          algorithm: 'test'
        },
        insights: {
          topSkills: ['skill1'],
          preferredLocations: ['location1'],
          averageScore: 80,
          improvementSuggestions: ['suggestion1']
        },
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };

      const action = { type: CLEAR_RECOMMENDATIONS };
      const newState = recommendationReducer(previousState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('Unknown action', () => {
    it('should return the current state for unknown actions', () => {
      const currentState = {
        ...initialState,
        loading: true,
        error: 'Some error'
      };

      const action = { type: 'UNKNOWN_ACTION' };
      const newState = recommendationReducer(currentState, action);

      expect(newState).toBe(currentState);
    });
  });
});