import React, { useState } from 'react';
import './RestaurantSignUp.css';

const RestaurantSignUp = () => {
  const [formData, setFormData] = useState({
    storeAddress: '',
    floorSuite: '',
    storeName: '',
    brandName: '',
    businessType: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    smsOptIn: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, maybe via an API call
    console.log(formData);
  };

  return (
    <div className="form-container">
      <h2>Get started</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="storeAddress">Store address</label>
          <input
            type="text"
            id="floorSuite"
            name="floorSuite"
            value={formData.storeAddress}
            onChange={handleChange}
            placeholder="Floor / Suite"
          />
        </div>

        <div className="form-group">
          <label htmlFor="floorSuite">Floor / Suite (Optional)</label>
          <input
            type="text"
            id="floorSuite"
            name="floorSuite"
            value={formData.floorSuite}
            onChange={handleChange}
            placeholder="Floor / Suite"
          />
        </div>

        <div className="form-group">
          <label htmlFor="storeName">Store name</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="Example: Sam's Pizza - 123 Main street"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brandName">Brand name</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            placeholder="Example: Sam's Pizza"
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessType">Business type</label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
          >
            <option value="" disabled>Select...</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Mobile phone number</label>
          <div className="phone-input">
            <select name="phoneCode" id="phoneCode">
              <option value="+1">US +1</option>
              <option value="+91">IN +91</option>
            </select>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Mobile phone number"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default RestaurantSignUp;
