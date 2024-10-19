// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import RestaurantSignUp from './Components/SignUp/RestaurantSignUp';
import Feed from './Components/Feed/Feed';
import Restaurant from './Components/Restaurant/Restaurant';
import UserProfile from './Components/UserProfile/UserProfile';

import DynamicNavbar from './Components/Navbar/DynamicNavbar';
import UserSidebarWrapper from './Components/UserSidebar/UserSidebarWrapper';
import Testpage from './Components/Testpage';


function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
 
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">
      <UserSidebarWrapper isOpen={isSidebarOpen} closeSidebar={closeSidebar}/>
      <DynamicNavbar toggleSidebar={toggleSidebar}/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/merchantsignup" element={<RestaurantSignUp />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/currentuser" element={<UserProfile />} />
        <Route path="/test" element={<Testpage/>}/>
      </Routes>
    </div>
  );
}

export default App;
