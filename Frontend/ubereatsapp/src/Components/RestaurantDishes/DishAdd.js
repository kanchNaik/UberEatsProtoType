import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import { useSelector } from 'react-redux';

const DishAdd = ({ isEdit }) => {
  const [dishDetails, setDishDetails] = useState({
    dish_name: '',
    description: '',
    price: '',
    category: '',
    dish_image: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();
  const { id } = useParams(); // Get the dish ID from the URL if editing

  useEffect(() => {
    if (isEdit) {
      fetchDishDetails();
    }
  }, [isEdit]);

  const fetchDishDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/dishes/${id}`, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setDishDetails(response.data);
    } catch (error) {
      console.error('Error fetching dish details:', error);
      setError('Failed to fetch dish details');
      messageService.showMessage('error', 'Failed to fetch dish details')
    }
  };

  const handleChange = (event) => {
    if (event.target.name === 'dish_image') {
      setDishDetails({ ...dishDetails, dish_image: event.target.files[0] });
    } else {
      setDishDetails({ ...dishDetails, [event.target.name]: event.target.value });
    }

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    isEdit ? updateDish() : addDish();
  };

  const addDish = async () => {
    try {
      const formData = new FormData();
      for (const key in dishDetails) {
        formData.append(key, dishDetails[key]);
      }

      await axios.post(`${BASE_API_URL}/api/dishes/`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setSuccessMessage('Dish added successfully!');
      messageService.showMessage('success', 'Dish added successfully!')
      navigate('/restaurant/dishes');
    } catch (error) {
      console.error('Error adding dish:', error);
      setError('Failed to add dish');
      messageService.showMessage('error', 'Failed to add dish')
    }
  };

  const updateDish = async () => {
    try {
      const formData = new FormData();
      for (const key in dishDetails) {
        formData.append(key, dishDetails[key]);
      }

      await axios.put(`${BASE_API_URL}/api/dishes/${id}/`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setSuccessMessage('Dish updated successfully!');
      messageService.showMessage('success', 'Dish updated successfully!')
      navigate('/restaurant/dishes');
    } catch (error) {
      console.error('Error updating dish:', error);
      setError('Failed to update dish');
      messageService.showMessage('success', 'Failed to update dish')
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{isEdit ? 'Edit Dish' : 'Add a New Dish'}</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
      {isEdit && dishDetails.dish_image && (
          <div className="form-group">
            <img src={dishDetails.dish_image} alt={dishDetails.dish_name} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
        {isEdit ? (
          <div className="form-group">
            <button type="button" className="btn btn-secondary" onClick={() => document.getElementById('fileInput').click()}>
              Choose New Image
            </button>
            <input
              type="file"
              id="fileInput"
              name="dish_image"
              onChange={handleChange}
              style={{ display: 'none' }}
              className="form-control-file"
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="dish_image">Image:</label>
            <input
              type="file"
              name="dish_image"
              onChange={handleChange}
              className="form-control-file"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="dish_name">Dish Name:</label>
          <input
            type="text"
            name="dish_name"
            value={dishDetails.dish_name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={dishDetails.description}
            onChange={handleChange}
            required
            className="form-control"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            value={dishDetails.price}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            value={dishDetails.category}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select category</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Salad">Salad</option>
            <option value="Main Course">Main Course</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          {isEdit ? 'Update Dish' : 'Add Dish'}
        </button>
      </form>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
      {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>}
    </div>
  );
};

export default DishAdd;
