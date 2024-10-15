import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Home from './Components/Home/Home'
import SignUp from './Components/SignUp/SignUp'
import './index.css';
import HomeNavbar from './Components/Navbar/HomeNavbar'
import SignUpNavbar from './Components/Navbar/SignUpNavbar';
import SignIn from './Components/SignIn/SignIn'
import RestaurantSignUp from './Components/SignUp/RestaurantSignUp'
import Feed from './Components/Feed/Feed'
import FeedNavbar from './Components/Navbar/FeedNavbar'
import Restaurant from './Components/Restaurant/Restaurant'
import UserSidebar from './Components/UserSidebar/UserSidebar';
import UserProfile from './Components/UserProfile/UserProfile'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Function to toggle the sidebar open/close
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Handle clicks outside of the sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to determine which navbar to render
  const renderNavbar = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return <HomeNavbar />;
      case '/signin':
      case '/signup':
        return <SignUpNavbar />;
      case '/feed':
        return <FeedNavbar onclick={toggleSidebar}/>
      default:
        return <SignUpNavbar />;
    }
  };

  return (
    <>
    <div className="App">
    {isSidebarOpen && (
          <div ref={sidebarRef}>
            <UserSidebar />
          </div>
        )}
    {renderNavbar()}
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/merchantsignup" element={<RestaurantSignUp />} />
        <Route path="feed" element={<Feed/>} />
        <Route path="/restaurant/:id" element={<Restaurant/>} />
        <Route path="/currentuser" element={<UserProfile/>} />
      </Routes>
    </div>
    </>
  );
}

export default App;
