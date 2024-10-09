import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignIn() {
    const [inputEmail, setInputEmailValue] = useState('');
    const [inputPassword, setInputPasswordValue] = useState('');

    const handleEmailChange = (event) => {
        setInputEmailValue(event.target.value); // Update input value on change
      };

    const handlePasswordChange = (event) => {
        setInputPasswordValue(event.target.value); // Update input value on change
      };

    const handleLogin = (e) => {
        e.preventDefault();
    
        // axios.post('http://localhost:8000/apis/login/', { inputEmail, inputPassword })
        //   .then((response) => {
        //     const { access, refresh, user_type } = response.data;
    
        //     // Store tokens and user type in cookies
        //     Cookies.set('access_token', response.data.token, { expires: 1 });
        //     Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
        //     Cookies.set('user_type', response.data.user_type);  // Assume user_type is returned from backend
        //     Cookies.set('user_name', inputEmail);
        //     Cookies.set('user_id', response.data.userid)
        //     console.log('Logged in successfully');
        //     // Optionally redirect to a protected page
        //     window.location.href = '/customer';
        //   })
        //   .catch((error) => {
        //     console.error('Login failed:', error);
        //   });

            Cookies.set('user_type', 'customer');  // Assume user_type is returned from backend
            Cookies.set('user_name', 'test');
            Cookies.set('user_email', inputEmail);
            Cookies.set('user_id', '1')
            console.log('Logged in successfully');
            // Optionally redirect to a protected page
            window.location.href = '/feed'
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
          onChange={handleEmailChange} // Update input value on change
        />
        <input
          type="text"
          className="input-field"
          placeholder="Enter your password"
          value={inputPassword}
          onChange={handlePasswordChange} // Update input value on change
        />
        <button type='submit' className="continue-button">
          Continue
        </button>
        </form>
      </div>
  )
}

export default SignIn