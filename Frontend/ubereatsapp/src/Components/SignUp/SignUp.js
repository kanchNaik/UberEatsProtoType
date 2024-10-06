import React, { useState } from 'react';
import './SignUp.css';

function SignUp() {
    const [inputName, setInputNameValue] = useState('');
    const [inputEmail, setInputEmailValue] = useState('');
    const [inputPassword, setInputPasswordValue] = useState('');

    const handleNameChange = (event) => {
        setInputNameValue(event.target.value); // Update input value on change
    };
  
    const handleEmailChange = (event) => {
        setInputEmailValue(event.target.value); // Update input value on change
      };

    const handlePasswordChange = (event) => {
        setInputPasswordValue(event.target.value); // Update input value on change
      };

    const handleContinueClick = () => {
      // Perform your desired action here, e.g., form validation, API call, etc.
      alert(`You entered: ${inputName}`); // Example action (replace with your logic)
    };
  
    return (
      <div className="signup-form-container">
        <h2 className="signup-form-title">Let's get you started</h2>
        <input
          type="text"
          className="input-field"
          placeholder="Enter your name"
          value={inputName}
          onChange={handleNameChange} // Update input value on change
        />
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
        <button className="continue-button" onClick={handleContinueClick}>
          Continue
        </button>
      </div>
  )
}

export default SignUp