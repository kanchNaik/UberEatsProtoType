import React, { useState } from 'react';
import './SignIn.css'; 
import axios from 'axios'; 
import Cookies from 'js-cookie'; 
import { useNavigate  } from 'react-router-dom';
import { messageService } from '../Common/Message/MessageService';
import { BASE_API_URL } from '../../Setupconstants';

function SignIn() {
  const navigate = useNavigate();

  const [inputEmail, setInputEmailValue] = useState('');
  const [inputPassword, setInputPasswordValue] = useState('');
  const [error, setError] = useState('');

  
  const handleEmailChange = (event) => setInputEmailValue(event.target.value);
  const handlePasswordChange = (event) => setInputPasswordValue(event.target.value);

  
  const handleLogin = (e) => {
    e.preventDefault(); 
    axios
      .post(`${BASE_API_URL}/api/login/`, {
        username: inputEmail,
        password: inputPassword,
      })
      .then((response) => {
        const {message, token, user } = response.data;
        // Store tokens and user info in cookies
        Cookies.set('access_token', token, { expires: 1 });
        Cookies.set('user_type', user.is_customer ? 'Customer' : 'Restaurant');
        Cookies.set('user_name', user.username);
        Cookies.set('user_id', user.id);
        Cookies.set('user_email', user.email)

        messageService.showMessage('success', 'Logged in successfully');

        if(user.is_customer) 
        {
           navigate('/feed')
        }
        else{
           navigate('/restaurant/home')
          }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('Invalid email or password'); // Show error message
        messageService.showMessage('error', 'Invalid email or password');
      });
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter your email"
          value={inputEmail}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Enter your password"
          value={inputPassword}
          onChange={handlePasswordChange}
        />
        {error && <p className="error-message">{error}</p>} {/* Show error if any */}
        <button type="submit" className="continue-button">
          Continue
        </button>
      </form>
    </div>
  );
}

export default SignIn;
