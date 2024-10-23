import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle CSRF token
import './FavoriteRestaurants.css'; // Optional: External CSS for styling

const FavoriteRestaurants = () => {
  const [favorites, setFavorites] = useState([]); // State to store favorite restaurants
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State for error handling

  // Fetch favorite restaurants on component mount
  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorite/', {
        withCredentials: true, // Include credentials (session cookies)
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
        },
      });

      if (response.status === 200) {
        setFavorites(response.data); // Set the favorite restaurants
      }
    } catch (error) {
      console.error('Error fetching favorite restaurants:', error);
      setError('Failed to load favorite restaurants. Please try again.');
    } finally {
      setLoading(false); // Stop loading when the fetch is complete
    }
  };

  // Fetch favorites when component mounts
  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return <p>Loading favorite restaurants...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (favorites.length === 0) {
    return <p>No favorite restaurants found.</p>;
  }

  return (
    <div className="favorites-list">
      <h2>Your Favorite Restaurants</h2>
      <div className="favorites-container">
        {favorites.map((restaurant) => (
          <div key={restaurant.id} className="favorite-card">
            <img
              src={restaurant.image_url || 'default-image.png'} // Placeholder if no image
              alt={restaurant.name}
              className="favorite-image"
            />
            <div className="favorite-details">
              <h4>{restaurant.restaurant_name}</h4>
              <p>Rating: ⭐ {restaurant.rating}</p>
              <p>Delivery Time: {restaurant.delivery_time}</p>
              {/* Add more details as necessary */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRestaurants;
