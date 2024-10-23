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
        const favoriteRestaurants = response.data.map((entry) => ({
          ...entry.restaurant, // Keep all restaurant details
          favoriteId: entry.id, // Store the favorite entry's id for removal
        }));
        setFavorites(favoriteRestaurants); // Set the favorite restaurants
      }
    } catch (error) {
      console.error('Error fetching favorite restaurants:', error);
      setError('Failed to load favorite restaurants. Please try again.');
    } finally {
      setLoading(false); // Stop loading when the fetch is complete
    }
  };

  // Handle removing a restaurant from favorites
  const removeFavorite = async (favoriteId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/favorite/${favoriteId}/`, {
        withCredentials: true, // Include credentials (session cookies)
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
        },
      });

      if (response.status === 204) { // Success, no content response
        setFavorites(favorites.filter(favorite => favorite.favoriteId !== favoriteId)); // Remove from list
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
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
          <div key={restaurant.favoriteId} className="favorite-card">
            <img
              src={restaurant.image || 'default-image.png'} // Placeholder if no image
              alt={restaurant.restaurant_name}
              className="favorite-image"
            />
            <div className="favorite-details">
              <h4>{restaurant.restaurant_name}</h4>
              <h6>{restaurant.location}</h6>
              <p>Rating: ⭐ {restaurant.rating}</p>
              <p>Delivery Time: {restaurant.delivery_time}</p>
              <p>Price Range: {restaurant.price_range}</p>
              <p>Contact: {restaurant.phone_number}</p>
              {/* Remove Favorite Button */}
              <button 
                className="remove-favorite-button" 
                onClick={() => removeFavorite(restaurant.favoriteId)}
              >
                Remove from Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRestaurants;
