// DynamicNavbar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import SignUpNavbar from './SignUpNavbar';
import FeedNavbar from './FeedNavbar';

const DynamicNavbar = ({ toggleSidebar, user }) => {
  const location = useLocation(); 
  const renderNavbar = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return <HomeNavbar user={user}/>;
      case '/signin':
      case '/signup':
        return <SignUpNavbar />;
      case '/feed':
        return <FeedNavbar onClick={toggleSidebar} user={user}/>;
      default:
        return <SignUpNavbar />;
    }
  };

  return <>{renderNavbar()}</>;
};

export default DynamicNavbar;
