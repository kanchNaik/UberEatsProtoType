// DynamicNavbar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import SignUpNavbar from './SignUpNavbar';
import FeedNavbar from './FeedNavbar';
import GenericTitleNavbar from './GenericTitleNavbar';
import { getUserInfo } from '../../Utilities/UserUtils';

const DynamicNavbar = ({ toggleSidebar }) => {
  const location = useLocation(); 

  const renderNavbar = () => {
debugger

    const user = getUserInfo();
    switch (location.pathname) {
      case '/':
      case '/home':
        return <HomeNavbar onClick={toggleSidebar} user={user}/>;
      case '/signin':
      case '/signup':
        return <SignUpNavbar />;
      case '/feed':
        return <FeedNavbar onClick={toggleSidebar} user={user}/>;
      case '/customer/my':
        return <GenericTitleNavbar title={'User Account'}/>
      default:
        return (user) ? (<FeedNavbar onClick={toggleSidebar} user={user}/>) : (<SignUpNavbar />);
    }
  };

  return <>{renderNavbar()}</>;
};

export default DynamicNavbar;
