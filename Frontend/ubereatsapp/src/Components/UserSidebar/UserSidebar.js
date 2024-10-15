import React from 'react';
import './UserSidebar.css'; // Custom styles (optional)
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const UserSidebar = () => {

  const navigate = useNavigate();
  const csrfToken = Cookies.get('access_token');
  const handleLogout = async () => {
    console.log('Token', Cookies.get('access_token'))
      try {
        const response = await axios.post('http://localhost:8000/api/logout/', {}, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
      });

      console.log('response status', response.status)

      if (response.status === 200) {
          // Remove user data from cookies
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          Cookies.remove('user_type');
          Cookies.remove('user_name');
          Cookies.remove('user_id');
          Cookies.remove('user_email');

          console.log('Logged out successfully');

          // Redirect to the login page
          navigate.push('/signin');}
      } catch (error) {
          console.log('Logout failed:', error);
      }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src="https://via.placeholder.com/50" alt="User Avatar" />
          </div>
          <div className="user-name">
            <h5>{Cookies.get('user_name')}</h5>
           <NavLink to="/currentuser"> <small>Manage account</small> </NavLink>
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li>Orders</li>
        <li>Wallet</li>
        <li>Meal plan</li>
        <li>Help</li>
        <li>Get a ride</li>
        <li>Promotions</li>
        <li>Uber One <span className="badge">Expires Oct 15</span></li>
        <li>Invite friends <span className="badge">You get ₹100 off</span></li>
      </ul>

      <div className="sidebar-footer">
        <button className="btn btn-link" onClick={handleLogout}>Sign out</button>
        <hr />
        <p className="sidebar-footer-item">Add your restaurant</p>
      </div>
    </div>
  );
};

export default UserSidebar;
