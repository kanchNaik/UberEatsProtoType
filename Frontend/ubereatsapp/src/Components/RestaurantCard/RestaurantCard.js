import React, { useState } from 'react';
import './RestaurantCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const RestaurantCard = ({ restaurantid, restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);
  const [favoriteId, setFavoriteId] = useState(restaurant.favoriteId);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent NavLink navigation

    if (isFavorite) {
      // If already a favorite, remove it from favorites
      try {
        const response = await axios.delete(
          `${BASE_API_URL}/api/favorite/${favoriteId}/`,
          {
            withCredentials: true, // Send cookies with request
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
            },
          }
        );

        if (response.status === 204) {
          console.log(`Restaurant ${restaurant.id} removed from favorites.`);
          setIsFavorite(false); // Update UI to reflect unfavorited status
          setFavoriteId(null);
        }
      } catch (error) {
        console.error('Error removing from favorites:', error);
        messageService.showMessage('error', 'We are unable to remove restaurant from favorites at the moment');
      }
    } else {
      // If not a favorite, add it to favorites
      try {
        const response = await axios.post(
          `${BASE_API_URL}/api/favorite/`,
          {
            restaurant_id: restaurant.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
            },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          console.log(`Restaurant ${restaurant.id} added to favorites.`);
          setIsFavorite(true); // Update UI to reflect favorited status
          setFavoriteId(response.data.favorite_id);
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
        messageService.showMessage('error', 'We are unable to add restaurant in favorites at the moment');
      }
    }
  };

  // Function to format delivery time in minutes
  const formatDeliveryTime = (time) => {
    const regex = /(\d+)\s*(hour|hrs|hr|h|min|mins|minute|minutes)/i;
    const match = time.match(regex);

    if (match) {
      const quantity = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      // Convert everything to minutes
      return unit.startsWith('h') ? quantity * 60 : quantity;
    }
    return time; // Return original time if no match
  };

  return (
    <div className=""> {/* Responsive grid item */}
      <div className="restaurantcard">
        <NavLink to={`/restaurant/${restaurant.id}`}>
          <div>
            <img
              src={restaurant.image} // Replace with the actual image URL
              alt={restaurant.restaurant_name}
              className="img-fluid" // Make the image responsive
            />
          </div>
          <div className="text-left restaurantcard-text">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h5>{restaurant.restaurant_name}</h5>
              <p>⭐ {restaurant.rating}</p>
            </div>
            <div style={{ position: 'relative', fontSize: '14px' }}>
              {/* Uber One benefits message */}
              {restaurant.uberone && (
                <p style={{ position: 'absolute', top: 0, left: 0 }}>
                  Uber One benefits apply
                </p>
              )}
              
              {/* Delivery time message */}
              <p style={{ position: restaurant.uberone ? 'absolute' : 'static', top: restaurant.uberone ? '20px' : '0', left: restaurant.uberone ? '0' : '0' }}>
                {formatDeliveryTime(restaurant.delivery_time)} min
              </p>
            </div>
          </div>
        </NavLink>

        {/* Favorite Button: Handle click without triggering navigation */}
        <button className="favorite-icon" onClick={toggleFavorite}>
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            size="lg"
            color={isFavorite ? 'red' : 'white'}
          />
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
