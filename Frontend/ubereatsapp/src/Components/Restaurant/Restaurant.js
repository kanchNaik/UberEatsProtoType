import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Restaurant.css';
import OrderOptions from '../OrderOptions/OrderOptions';
import Menu from '../Menu/Menu';
import MenuItem from '../MenuItem/MenuItem'

// Group items by category key
const groupBy = (items, key) => {
  return items.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});
};

const Restaurant = () => {
  const { id } = useParams(); // Get restaurant id from the URL
  const [restaurant, setRestaurant] = useState(null); // Store restaurant details
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(''); // Track active category

  const categoryRefs = useRef({}); // Store refs for category sections

  useEffect(() => {
    // Fetch restaurant data by id
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/restaurants/${id}`, {
          withCredentials: true,
        });
        setRestaurant(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch featured items for the restaurant
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/restaurants/${id}/dishes`, {
          withCredentials: true,
        });
        setFeaturedItems(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
    fetchFeaturedItems();
  }, [id]);

  const groupedItems = groupBy(featuredItems, 'category'); // Group by 'category' field

  // Track scroll position to highlight the active category
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    let active = '';

    // Check which category is visible
    Object.entries(categoryRefs.current).forEach(([category, ref]) => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        if (top <= 100) {
          active = category; // Set active category if it's in view
        }
      }
    });

    if (active !== activeCategory) {
      setActiveCategory(active);
    }
  }, [activeCategory]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, [handleScroll]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="restaurant-container">
      <div className="container">
        {restaurant && (
          <>
            <section className="restaurant-banner">
              <img
                src={restaurant.profile_url}
                alt={restaurant.restaurant_name}
                className="banner-image"
              />
            </section>
            <div className="row">
              <div className="col-4">
                <div className="restaurant-info-container">
                  <h2 className="restaurant-name">{restaurant.restaurant_name}</h2>
                  <div className="restaurant-details">
                    <span className="restaurant-rating">
                      {restaurant.rating} <span className="star">★</span> ({restaurant.totalReviews}+)
                    </span>
                    <span>{restaurant.price_range}</span>
                    {restaurant.uberone && (
                      <span className="uber-one">
                        <img src="/path-to-uber-one-icon.png" alt="Uber One" className="uber-one-icon" />
                        Uber One
                      </span>
                    )}
                    <a href="/info" className="info-link">Info</a>
                  </div>
                  <div className="delivery-info">
                    <span className="delivery-icon">🚚</span> {restaurant.deliveryInfo}
                  </div>
                </div>
                <div className="sticky-menu">
                  <Menu categories={Object.keys(groupedItems)} activeCategory={activeCategory} />
                </div>
              </div>
              <div className="col-8">
                <OrderOptions />
                {Object.entries(groupedItems).map(([category, items], index) => {
                  const ref = React.createRef(); // Create a ref for each category
                  categoryRefs.current[category] = ref; // Store ref in the object

                  return (
                    <div key={index} className="menu-group" ref={ref}>
                      <h2>{category}</h2> {/* Render category name */}
                      <div className="row">
                        {items.map((item, itemIndex) => (
                          <div className="col-4" key={itemIndex}>
                            <MenuItem menu={item} /> {/* Render DishCard for each dish */}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
