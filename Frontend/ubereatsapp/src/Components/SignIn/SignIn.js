import React, { useState } from 'react';
import './SignIn.css'; // Ensure your CSS file exists
import axios from 'axios'; // Axios for HTTP requests
import Cookies from 'js-cookie'; // To manage cookies

function SignIn() {
  const [inputEmail, setInputEmailValue] = useState('');
  const [inputPassword, setInputPasswordValue] = useState('');
  const [error, setError] = useState(''); // Error state for displaying errors

  // Handle input changes
  const handleEmailChange = (event) => setInputEmailValue(event.target.value);
  const handlePasswordChange = (event) => setInputPasswordValue(event.target.value);

  // Handle login using Promises
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page refresh
    debugger;
    axios
      .post('http://localhost:8000/api/login/', {
        username: inputEmail,
        password: inputPassword,
      }, {
        withCredentials: true,  // Ensure this is set to true
    })
      .then((response) => {
        const {message, token, user } = response.data;
        debugger;
        // Store tokens and user info in cookies
        Cookies.set('access_token', token, { expires: 1 });
        Cookies.set('user_type', user.is_customer ? 'Customer' : 'Restaurant');
        Cookies.set('user_name', user.username);
        Cookies.set('user_id', user.id);
        Cookies.set('user_email', user.email)
        console.log('token', token)
        console.log('Logged in successfully');
        console.log(Cookies.get('csrftoken'))
        window.location.href = '/feed'; // Redirect to feed page
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('Invalid email or password'); // Show error message
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
