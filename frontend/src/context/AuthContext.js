import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  
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
    loadUser();
  }, [loadUser]);

  // Context value
  const value = {
    // Auth state from Redux
    ...authState,
    
    // Auth methods from hook
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 