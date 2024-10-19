// UserSidebarWrapper.js
import React, { useRef, useEffect } from 'react';
import UserSidebar from './UserSidebar';

const UserSidebarWrapper = ({ isOpen, closeSidebar  }) => {
  const sidebarRef = useRef(null);

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

  return (
    <>
      {isOpen && (
        <div ref={sidebarRef}>
          <UserSidebar />
        </div>
      )}
    </>
  );
};

export default UserSidebarWrapper;
