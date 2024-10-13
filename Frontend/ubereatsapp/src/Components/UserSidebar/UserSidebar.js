import React from 'react';
import './UserSidebar.css'; // Custom styles (optional)

const UserSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src="https://via.placeholder.com/50" alt="User Avatar" />
          </div>
          <div className="user-name">
            <h5>kanchan</h5>
            <small>Manage account</small>
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
        <button className="btn btn-link">Sign out</button>
        <hr />
        <p className="sidebar-footer-item">Create a business account</p>
        <p className="sidebar-footer-item">Add your restaurant</p>
      </div>
    </div>
  );
};

export default UserSidebar;
