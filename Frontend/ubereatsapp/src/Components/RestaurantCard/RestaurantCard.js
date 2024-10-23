import React, { useState } from 'react';
import './RestaurantCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const RestaurantCard = ({restaurantid, restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);
  const [favoriteId, setFavoriteId] = useState(restaurant.favoriteId);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent NavLink navigation
    debugger;
    if (isFavorite) {
      // If already a favorite, remove it from favorites
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/favorite/${favoriteId}/`,
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
          setFavoriteId(null)
        }
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      // If not a favorite, add it to favorites
      try {
        const response = await axios.post(
          'http://localhost:8000/api/favorite/',
          {
            restaurant_id: restaurant.id,
          },
          {
            // Send cookies with request
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
          setFavoriteId(response.data.favorite_id)
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  return (
    <div className='col-sm-3'>
      <div className="restaurantcard">
        <NavLink to={`/restaurant/${restaurant.id}`}>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/Assets/dominos.webp`} // Replace with the actual image URL
              alt="Feed Your Employees"
              className="img-fluid"
            />
          </div>
          <div className="text-left restaurantcard-text">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h5>{restaurant.restaurant_name}</h5>
              <p>⭐ {restaurant.rating}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              {restaurant.uberone ? <p>Uber One benefits apply</p> : <span />}
              <p>{restaurant.delivery_time}</p>
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
