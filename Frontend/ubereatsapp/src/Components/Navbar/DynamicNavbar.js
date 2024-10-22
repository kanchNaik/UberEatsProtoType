import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import SignUpNavbar from './SignUpNavbar';
import FeedNavbar from './FeedNavbar';
import GenericTitleNavbar from './GenericTitleNavbar';
import RestaurantFeedNavbar from './RestaurantFeedNavbar';
import UserSidebarWrapper from '../UserSidebar/UserSidebarWrapper';
import RestaurantProfileSidebarWrapper from '../RestaurantProfileSidebar/RestaurantProfileSidebarWrapper'
import { getUserInfo } from '../../Utilities/UserUtils';
import { useSelector } from 'react-redux';

const DynamicNavbar = () => {
  const cartCount = useSelector((state) => state.cart?.cartItemCount ?? 0);

  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // Toggle sidebar
  const closeSidebar = () => setSidebarOpen(false); // Close sidebar
  const user = getUserInfo();

  const renderNavbar = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return <HomeNavbar onClick={toggleSidebar} user={user} />;
      case '/signin':
      case '/signup':
        return <SignUpNavbar />;
      case '/feed':
        return user && user.userType === 'Customer' ? (
          <FeedNavbar onClick={toggleSidebar} user={user} itemCount = {cartCount}/>
        ) : (
          <RestaurantFeedNavbar onClick={toggleSidebar} user={user} />
        );
      case '/customer/my':
        return <GenericTitleNavbar title="User Account" />;
      default:
        return user ? (
          user.userType === 'Customer' ? (
            <FeedNavbar onClick={toggleSidebar} user={user} itemCount = {cartCount}/>
          ) : (
            <RestaurantFeedNavbar onClick={toggleSidebar} user={user} />
          )
        ) : (
          <SignUpNavbar />
        );
    }
  };

  return (
    <div>
      {(user && user.userType === 'Customer') ?  <UserSidebarWrapper isOpen={isSidebarOpen} closeSidebar={closeSidebar} /> : <RestaurantProfileSidebarWrapper isOpen={isSidebarOpen} closeSidebar={closeSidebar}/>}
      {renderNavbar()}
    </div>
  );
};

export default DynamicNavbar;
