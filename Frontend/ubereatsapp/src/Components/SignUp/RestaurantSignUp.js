import React, { useState } from 'react';
import axios from 'axios';
import './RestaurantSignUp.css';
import Cookies from 'js-cookie';
import { useNavigate  } from 'react-router-dom';

const RestaurantSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    is_restaurant: true,
    restaurant: {
      phone_number: '',
      location: '',
      restaurant_name: '',
      description: '',
      price_range: '',
      delivery_time: '', // Keep this as a string initially
      uberone: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Check if 'name' exists and is a string
    if (name && typeof name === 'string') {
      const keys = name.split('.'); // For nested fields like 'restaurant.phone_number'

      if (keys.length === 1) {
        // Simple field (no dot notation)
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
      } else if (keys.length === 2) {
        // Nested field (dot notation)
        setFormData((prev) => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: type === 'checkbox' ? checked : value,
          },
        }));
      } else {
        console.error(`Invalid field name structure: ${name}`);
      }
    } else {
      console.error('Field name is undefined or not a string:', e.target);
    }
  };

  const handleDeliveryTimeChange = (e) => {
    const { value } = e.target;

    // Check if value is a number and within a reasonable range
    if (!isNaN(value) && value >= 0) {
      setFormData((prev) => ({
        ...prev,
        restaurant: {
          ...prev.restaurant,
          delivery_time: value, // Store as a number or string directly
        },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ip_address = 'http://13.56.179.210/'
    axios
      .post(ip_address+'/api/signup/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Success:', response.data);
        navigate('/signin'); // Navigate on success
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  return (
    <div className="form-container">
      <h2>Restaurant Signup</h2>
      <form onSubmit={handleSubmit}>
        {/* Account Details */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Restaurant Information */}
        <div className="form-group">
          <label>Restaurant Name</label>
          <input
            type="text"
            name="restaurant.restaurant_name"
            value={formData.restaurant.restaurant_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="restaurant.phone_number"
            value={formData.restaurant.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="restaurant.location"
            value={formData.restaurant.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="restaurant.description"
            value={formData.restaurant.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price Range</label>
          <select
            name="restaurant.price_range"
            value={formData.restaurant.price_range}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select price range</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Delivery Time (Minutes)</label>
          <input
            type="number"
            name="restaurant.delivery_time"
            value={formData.restaurant.delivery_time} // Use the raw number value
            onChange={handleDeliveryTimeChange} // Use the new handler
            min="0" // Ensure that the input is non-negative
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="restaurant.uberone"
              checked={formData.restaurant.uberone}
              onChange={handleChange}
            />
            Uber One Partner
          </label>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default RestaurantSignUp;
