import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Function to check if the user is already authenticated
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
    setLoading(false); // Update loading status once done
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    setIsAuthenticated(true);
    setUserType(userType);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  }, []);

  const contextValue = {
    isAuthenticated,
    userType,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
