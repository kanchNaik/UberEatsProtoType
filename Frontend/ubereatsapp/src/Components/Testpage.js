import React, { useState } from 'react';

const UserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    is_customer: true,
    username: '',
    customer: {
      phone_number: '',
      nickname: '',
      date_of_birth: '',
      city: '',
      state: '',
      country: '',
      name: '',
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
    // Handle form submission logic here (e.g., send formData to an API)
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
    
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Is Customer:</label>
        <input
          type="checkbox"
          name="is_customer"
          checked={formData.is_customer}
          onChange={handleChange}
        />
      </div>
      <h3>Customer Details</h3>
      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          name="customer.phone_number"
          value={formData.customer.phone_number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nickname:</label>
        <input
          type="text"
          name="customer.nickname"
          value={formData.customer.nickname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="customer.date_of_birth"
          value={formData.customer.date_of_birth}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="customer.city"
          value={formData.customer.city}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          name="customer.state"
          value={formData.customer.state}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          name="customer.country"
          value={formData.customer.country}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
