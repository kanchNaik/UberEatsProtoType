import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, allowedUserType, userType }) => {
  if (!isAuthenticated) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/signin" />;
  }

  if (allowedUserType && allowedUserType !== userType) {
    // Redirect to a default page (like home) if the user type doesn't match
    return <Navigate to="/" />;
  }

  // Render the protected component if authenticated and user type matches
  return children;
};

export default ProtectedRoute;
