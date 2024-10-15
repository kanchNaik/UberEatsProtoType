import CookieHandler from "../../Handlers/CookieHandler";
import UserHandler from "../../Handlers/UserHandler";

import React from 'react';
import './UserProfile.css';  
import { FaPen } from 'react-icons/fa'; 
import Cookies from 'js-cookie'; 

const UserProfile = () => {
    const userName = Cookies.get('user_name');
    const userEmail = Cookies.get('user_email');
    
    return (
        <div className="account-info">
            <h1>Account Info</h1>
            
            <div className="profile-section">
                <div className="profile-image">
                    <img 
                        src="https://via.placeholder.com/100"  // Placeholder image URL
                        alt="profile"
                        className="profile-pic"
                    />
                    <button className="edit-button">
                        <FaPen/>  {/* Font Awesome edit icon */}
                    </button>
                </div>
            </div>

            <div className="basic-info">
                <h2>Basic Info</h2>

                <div className="info-row">
                    <label>Name</label>
                    <p>{userName}</p>
                </div>

                <div className="info-row">
                    <label>Phone number</label>
                    <p>+918805947163 <span className="verified">&#10004;</span></p>
                </div>

                <div className="info-row">
                    <label>Email</label>
                    <p>{userEmail} <span className="verified">&#10004;</span></p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
