import React from 'react';
import './RestaurantProfileSidebar.css'; // Custom styles (optional)
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { getUserInfo } from '../../Utilities/UserUtils';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';


const RestaurantProfileSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Token', Cookies.get('csrftoken'))
    console.log('sessionid', Cookies.get('sessionid'))
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/logout/`,  // URL for logout
        {},  // No data to send in body for logout
        {
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),  // CSRF token from cookies
            },
            withCredentials: true,  // Include cookies with the request
        }
    );
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
          navigate('/signin');
        }
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
           <NavLink to="/restaurant/my"> <small>Manage account</small> </NavLink>
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
      <NavLink to="/restaurant/orders"><li>Orders</li></NavLink>
        <li>Help</li>
        <NavLink to="/restaurant/dishes"> <li>Dishes</li></NavLink>
      </ul>

      <div className="sidebar-footer">
        <button className="btn btn-link" onClick={handleLogout}>Sign out</button>
      </div>
    </div>
  );
};

export default RestaurantProfileSidebar;
