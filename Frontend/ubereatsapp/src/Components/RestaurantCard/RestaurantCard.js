import React, { useState } from 'react';
import './RestaurantCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Prevent the NavLink from triggering when clicking the heart
  const toggleFavorite = (e) => {
    e.preventDefault(); // Stop NavLink navigation
    setIsFavorite(!isFavorite);
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
