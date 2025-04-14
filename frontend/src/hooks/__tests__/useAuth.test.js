import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../useAuth';
import * as authActions from '../../store/actions/authActions';

// Mock the required dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../../store/actions/authActions', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
  updatePassword: jest.fn()
}));

describe('useAuth Hook', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockAuthState = {
    user: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'user'
    },
    isAuthenticated: true,
    loading: false,
    error: null
  };
  
  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(mockAuthState));
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });
  
  test('should return the authentication state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockAuthState.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  test('should call login action with correct parameters', () => {
    const mockLoginPromise = Promise.resolve();
    authActions.login.mockReturnValue(mockLoginPromise);
    mockDispatch.mockReturnValue(mockLoginPromise);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.loginUser('john@example.com', 'password');
    });
    
    expect(authActions.login).toHaveBeenCalledWith('john@example.com', 'password');
    expect(mockDispatch).toHaveBeenCalled();
  });
  
  test('should navigate to dashboard after successful login', async () => {
    const mockLoginPromise = Promise.resolve();
    authActions.login.mockReturnValue(mockLoginPromise);
    mockDispatch.mockReturnValue(mockLoginPromise);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.loginUser('john@example.com', 'password');
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  
  test('should call register action with correct parameters', () => {
    const userData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'password'
    };
    
    const mockRegisterPromise = Promise.resolve();
    authActions.register.mockReturnValue(mockRegisterPromise);
    mockDispatch.mockReturnValue(mockRegisterPromise);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.registerUser(userData);
    });
    
    expect(authActions.register).toHaveBeenCalledWith(userData);
    expect(mockDispatch).toHaveBeenCalled();
  });
  
  test('should call logout action and navigate to login page', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logoutUser();
    });
    
    expect(authActions.logout).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  
  test('should call updateProfile action with correct parameters', () => {
    const profileData = {
      first_name: 'John',
      last_name: 'Smith'
    };
    
    const mockUpdateProfilePromise = Promise.resolve();
    authActions.updateProfile.mockReturnValue(mockUpdateProfilePromise);
    mockDispatch.mockReturnValue(mockUpdateProfilePromise);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.updateUserProfile(profileData);
    });
    
    expect(authActions.updateProfile).toHaveBeenCalledWith(profileData);
    expect(mockDispatch).toHaveBeenCalled();
  });
  
  test('should call updatePassword action with correct parameters', () => {
    const passwordData = {
      current_password: 'oldpassword',
      new_password: 'newpassword'
    };
    
    const mockUpdatePasswordPromise = Promise.resolve();
    authActions.updatePassword.mockReturnValue(mockUpdatePasswordPromise);
    mockDispatch.mockReturnValue(mockUpdatePasswordPromise);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.updateUserPassword(passwordData);
    });
    
    expect(authActions.updatePassword).toHaveBeenCalledWith(passwordData);
    expect(mockDispatch).toHaveBeenCalled();
  });
  
  test('should correctly check if user has a role', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.hasRole('user')).toBe(true);
    expect(result.current.hasRole('admin')).toBe(false);
  });
  
  test('should handle hasRole correctly when user has roles array', () => {
    useSelector.mockImplementation(() => ({
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        role: undefined,
        roles: ['user', 'editor']
      }
    }));
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.hasRole('user')).toBe(true);
    expect(result.current.hasRole('editor')).toBe(true);
    expect(result.current.hasRole('admin')).toBe(false);
  });
  
  test('should handle hasRole correctly when user is null', () => {
    useSelector.mockImplementation(() => ({
      ...mockAuthState,
      user: null
    }));
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.hasRole('user')).toBe(false);
  });
}); 