import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getJobRecommendations,
  getReferrerRecommendations,
  getTrendingJobs,
  getPersonalizedFeed,
  getRecommendationInsights,
  provideFeedback,
  clearRecommendations,
  refreshRecommendations,
  RECOMMENDATION_LOADING,
  RECOMMENDATION_ERROR,
  SET_JOB_RECOMMENDATIONS,
  SET_REFERRER_RECOMMENDATIONS,
  SET_TRENDING_JOBS,
  SET_PERSONALIZED_FEED,
  SET_RECOMMENDATION_INSIGHTS,
  CLEAR_RECOMMENDATIONS
} from '../recommendationActions';
import { SET_ALERT } from '../uiActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axios);

// Mock the API base URL
const API_BASE_URL = 'http://localhost:8000/api';

describe('Recommendation Actions', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getJobRecommendations', () => {
    it('should dispatch SET_JOB_RECOMMENDATIONS on successful API call', async () => {
      const mockResponse = {
        data: {
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
        }
      };

      mock.onGet(`${API_BASE_URL}/recommendations/jobs`).reply(200, mockResponse);

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: SET_JOB_RECOMMENDATIONS, payload: mockResponse.data }
      ];

      const store = mockStore({});
      await store.dispatch(getJobRecommendations());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch RECOMMENDATION_ERROR on API failure', async () => {
      const errorMessage = 'Failed to load job recommendations';
      mock.onGet(`${API_BASE_URL}/recommendations/jobs`).reply(500, {
        message: errorMessage
      });

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: RECOMMENDATION_ERROR, payload: errorMessage },
        { type: SET_ALERT, payload: { message: errorMessage, type: 'error' } }
      ];

      const store = mockStore({});
      await store.dispatch(getJobRecommendations());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should include query parameters when provided', async () => {
      const options = { limit: 5, excludeApplied: false, includeScore: true };
      
      mock.onGet(`${API_BASE_URL}/recommendations/jobs`).reply((config) => {
        const params = new URLSearchParams(config.url.split('?')[1]);
        expect(params.get('limit')).toBe('5');
        expect(params.get('excludeApplied')).toBe('false');
        expect(params.get('includeScore')).toBe('true');
        return [200, { data: { recommendations: [], total: 0 } }];
      });

      const store = mockStore({});
      await store.dispatch(getJobRecommendations(options));
    });
  });

  describe('getReferrerRecommendations', () => {
    it('should dispatch SET_REFERRER_RECOMMENDATIONS on successful API call', async () => {
      const jobId = 123;
      const mockResponse = {
        data: {
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
        }
      };

      mock.onGet(`${API_BASE_URL}/recommendations/referrers/${jobId}`).reply(200, mockResponse);

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { 
          type: SET_REFERRER_RECOMMENDATIONS, 
          payload: { jobId, ...mockResponse.data }
        }
      ];

      const store = mockStore({});
      await store.dispatch(getReferrerRecommendations(jobId));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should handle API errors', async () => {
      const jobId = 123;
      const errorMessage = 'Job not found';
      
      mock.onGet(`${API_BASE_URL}/recommendations/referrers/${jobId}`).reply(404, {
        message: errorMessage
      });

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: RECOMMENDATION_ERROR, payload: errorMessage },
        { type: SET_ALERT, payload: { message: errorMessage, type: 'error' } }
      ];

      const store = mockStore({});
      await store.dispatch(getReferrerRecommendations(jobId));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getTrendingJobs', () => {
    it('should dispatch SET_TRENDING_JOBS on successful API call', async () => {
      const mockResponse = {
        data: {
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
        }
      };

      mock.onGet(`${API_BASE_URL}/recommendations/trending`).reply(200, mockResponse);

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: SET_TRENDING_JOBS, payload: mockResponse.data }
      ];

      const store = mockStore({});
      await store.dispatch(getTrendingJobs());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getPersonalizedFeed', () => {
    it('should dispatch SET_PERSONALIZED_FEED on successful API call', async () => {
      const mockResponse = {
        data: {
          feed: [
            {
              id: 1,
              title: 'Recommended Job',
              feedType: 'recommended'
            },
            {
              id: 2,
              title: 'Trending Job',
              feedType: 'trending'
            }
          ],
          total: 2,
          composition: { recommended: 1, trending: 1 },
          algorithm: 'hybrid-recommendation-trending'
        }
      };

      mock.onGet(`${API_BASE_URL}/recommendations/feed`).reply(200, mockResponse);

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: SET_PERSONALIZED_FEED, payload: mockResponse.data }
      ];

      const store = mockStore({});
      await store.dispatch(getPersonalizedFeed());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getRecommendationInsights', () => {
    it('should dispatch SET_RECOMMENDATION_INSIGHTS on successful API call', async () => {
      const mockResponse = {
        data: {
          topSkills: ['javascript', 'react'],
          preferredLocations: ['San Francisco'],
          averageScore: 75.5,
          improvementSuggestions: ['Add more skills to your profile']
        }
      };

      mock.onGet(`${API_BASE_URL}/recommendations/insights`).reply(200, mockResponse);

      const expectedActions = [
        { type: RECOMMENDATION_LOADING },
        { type: SET_RECOMMENDATION_INSIGHTS, payload: mockResponse.data }
      ];

      const store = mockStore({});
      await store.dispatch(getRecommendationInsights());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('provideFeedback', () => {
    it('should show success alert on successful feedback submission', async () => {
      const jobId = 123;
      const feedback = 'helpful';
      const reason = 'Great match for my skills';

      mock.onPost(`${API_BASE_URL}/recommendations/feedback/${jobId}`).reply(200, {
        data: { jobId, feedback, reason }
      });

      const expectedActions = [
        { type: SET_ALERT, payload: { message: 'Thank you for your feedback!', type: 'success' } }
      ];

      const store = mockStore({});
      await store.dispatch(provideFeedback(jobId, feedback, reason));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should show error alert on feedback submission failure', async () => {
      const jobId = 123;
      const feedback = 'invalid_feedback';
      const errorMessage = 'Invalid feedback value';

      mock.onPost(`${API_BASE_URL}/recommendations/feedback/${jobId}`).reply(400, {
        message: errorMessage
      });

      const expectedActions = [
        { type: SET_ALERT, payload: { message: errorMessage, type: 'error' } }
      ];

      const store = mockStore({});
      await store.dispatch(provideFeedback(jobId, feedback));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('clearRecommendations', () => {
    it('should dispatch CLEAR_RECOMMENDATIONS action', () => {
      const expectedAction = { type: CLEAR_RECOMMENDATIONS };
      expect(clearRecommendations()).toEqual(expectedAction);
    });
  });

  describe('refreshRecommendations', () => {
    it('should clear and refetch all recommendation data', async () => {
      // Mock all API calls
      mock.onGet(`${API_BASE_URL}/recommendations/jobs`).reply(200, {
        data: { recommendations: [], total: 0 }
      });
      mock.onGet(`${API_BASE_URL}/recommendations/trending`).reply(200, {
        data: { trendingJobs: [], total: 0 }
      });
      mock.onGet(`${API_BASE_URL}/recommendations/insights`).reply(200, {
        data: { topSkills: [], preferredLocations: [], averageScore: 0, improvementSuggestions: [] }
      });

      const store = mockStore({});
      await store.dispatch(refreshRecommendations());

      const actions = store.getActions();
      
      // Should include clear action and loading actions for each API call
      expect(actions.some(action => action.type === CLEAR_RECOMMENDATIONS)).toBe(true);
      expect(actions.some(action => action.type === SET_JOB_RECOMMENDATIONS)).toBe(true);
      expect(actions.some(action => action.type === SET_TRENDING_JOBS)).toBe(true);
      expect(actions.some(action => action.type === SET_RECOMMENDATION_INSIGHTS)).toBe(true);
      expect(actions.some(action => 
        action.type === SET_ALERT && 
        action.payload.message === 'Recommendations refreshed!'
      )).toBe(true);
    });
  });
});