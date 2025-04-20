import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const [authTimeout, setAuthTimeout] = useState(false);
  
  const {
    loginUser,
    registerUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    loadUser
  } = useAuth();

  // Load user on mount
  useEffect(() => {
    // Start a loading timeout
    const timeoutId = setTimeout(() => {
      if (authState.loading) {
        setAuthTimeout(true);
      }
    }, 8000); // Show message after 8 seconds of loading
    
    loadUser();
    
    // Clear timeout when component unmounts or when loading completes
    return () => clearTimeout(timeoutId);
  }, [loadUser]);
  
  // Reset timeout flag if loading completes or fails
  useEffect(() => {
    if (!authState.loading) {
      setAuthTimeout(false);
    }
  }, [authState.loading]);

  // Context value
  const value = {
    // Auth state from Redux
    ...authState,
    
    // Auth methods from hook
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    requestPasswordReset,
    resetPassword,
    
    // Loading timeout flag
    authTimeout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 