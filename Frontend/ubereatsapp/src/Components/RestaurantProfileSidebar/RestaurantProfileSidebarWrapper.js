// UserSidebarWrapper.js
import React, { useRef, useEffect } from 'react';
import RestaurantProfileSidebar from './RestaurantProfileSidebar';
import { useLocation } from 'react-router-dom';
import {getUserInfo} from '../../Utilities/UserUtils'

const RestaurantProfileSidebarWrapper = ({ isOpen, closeSidebar  }) => {
  const user = getUserInfo();

  const sidebarRef = useRef(null);
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar(); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close sidebar when the URL changes
    closeSidebar();
  }, [location]); 

  return (
    <>
      {isOpen && (
        <div ref={sidebarRef}>
          <RestaurantProfileSidebar userId = {user?.userId}/>
        </div>
      )}
    </>
  );
};

export default RestaurantProfileSidebarWrapper;
