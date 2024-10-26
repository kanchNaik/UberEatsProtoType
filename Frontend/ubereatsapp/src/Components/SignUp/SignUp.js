import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate  } from 'react-router-dom';
import { messageService } from '../Common/Message/MessageService';
import { BASE_API_URL } from '../../Setupconstants';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    is_customer: true,
    username: '',
    customer: {
      phone_number: '',
      date_of_birth: '',
      city: '',
      state: '',
      country: '',
      name: '',
      nickname:''
    },
  });

  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
        setCountries(data.data); // Assuming data.data contains the array of country objects
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states based on selected country
  const handleCountryChange = async (e) => {
    const countryName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      customer: {
        ...prevData.customer,
        country: countryName,
        state: '', // Reset state when country changes
        city: '', // Reset city when country changes
      },
    }));

    if (countryName) {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country: countryName }),
        });
        const data = await response.json();
        setStates(data.data.states); // Assuming data.data.states contains the array of state objects
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    } else {
      setStates([]); // Clear states if no country is selected
      setCities([]); // Clear cities if no country is selected
    }
  };

  // Fetch cities based on selected state
  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      customer: {
        ...prevData.customer,
        state: stateName,
        city: '', // Reset city when state changes
      },
    }));

    if (stateName && formData.customer.country) {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: formData.customer.country,
            state: stateName,
          }),
        });
        const data = await response.json();
        setCities(data.data); // Assuming data.data contains the array of city names
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setCities([]); // Clear cities if no state is selected
    }
  };

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Check for minimum length and at least one number and one uppercase letter
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{};':"\\|,.<>?/-]{8,}$/; // Minimum 8 characters, at least one uppercase letter and one number
    return passwordPattern.test(password);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    } else if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters long, contain at least one uppercase letter and one number.');
      } else {
        setPasswordError('');
      }
    }

    if (name.startsWith('customer.')) {
      setFormData((prevData) => ({
        ...prevData,
        customer: {
          ...prevData.customer,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  // Validate email and password before submission
  if (!validateEmail(formData.email)) {
    messageService.showMessage('error', 'Please enter a valid email address.');
    return;
  }

  if (!validatePassword(formData.password)) {
     messageService.showMessage('error', 'Password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
    return;
  }

  // Send the API request using fetch
  fetch(`${BASE_API_URL}/api/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  },{
    withCredentials: true, // Include cookies with the request
})
    .then((response) => {
      if (!response.ok) {
        messageService.showMessage('error', 'Signup failed. Please try again.');
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
      messageService.showMessage('success', 'You are successfully signed up');
      navigate('/signin');
    })
    .catch((error) => {
      console.error('Error:', error);
      messageService.showMessage('error', 'Signup failed. Please try again.');
    });
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Let's get you started</h2>
      <form onSubmit={handleSubmit}>
        <div className='input-item'>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className='input-field'
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className='input-item'>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <div className='input-item'>
          <label>Name:</label>
          <input
            type="text"
            name="customer.name"
            className="input-field"
            placeholder="Enter your name"
            value={formData.customer.name}
            onChange={handleChange}
          />
        </div>
        <div className='input-item'>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className="input-field"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <h3>Additional Details</h3>
        <div className='input-item'>
          <label>Phone number:</label>
          <input
            type="tel"
            name="customer.phone_number"
            className="input-field"
            placeholder="Enter your phone number (include country code)"
            value={formData.customer.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Nickname:</label>
          <input
            type="text"
            name="customer.nickname"
            className="input-field"
            placeholder="Enter your nickname"
            value={formData.customer.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="customer.date_of_birth"
            className="input-field"
            value={formData.customer.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Country:</label>
          <select
            name="customer.country"
            value={formData.customer.country}
            onChange={handleCountryChange}
            className="input-field"
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.country} value={country.country}>{country.country}</option>
            ))}
          </select>
        </div>
        <div className='input-item'>
          <label>State:</label>
          <select
            name="customer.state"
            value={formData.customer.state}
            onChange={handleStateChange}
            className="input-field"
            required
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>
        <div className='input-item'>
          <label>City:</label>
          <select
            name="customer.city"
            value={formData.customer.city}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="continue-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
