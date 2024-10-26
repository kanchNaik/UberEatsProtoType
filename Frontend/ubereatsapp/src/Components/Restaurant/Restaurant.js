import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Restaurant.css';
import OrderOptions from '../OrderOptions/OrderOptions';
import Menu from '../Menu/Menu';
import MenuItem from '../MenuItem/MenuItem';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

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
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/restaurants/${id}`, {
          withCredentials: true,
        });
        setRestaurant(response.data);
      } catch (error) {
        setError(error.message);
        messageService.showMessage('error', 'Error in fetching restaurants')
      }
    };

    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/restaurants/${id}/dishes`, {
          withCredentials: true,
        });
        setFeaturedItems(response.data);
      } catch (error) {
        setError(error.message);
        messageService.showMessage('error', 'Error in fetching menu items')
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
    fetchFeaturedItems();
  }, [id]);

  const groupedItems = groupBy(featuredItems, 'category');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    let active = '';

    Object.entries(categoryRefs.current).forEach(([category, ref]) => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        if (top <= 100) {
          active = category;
        }
      }
    });

    if (active !== activeCategory) {
      setActiveCategory(active);
    }
  }, [activeCategory]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="restaurant-container container">
      {restaurant && (
        <>
          <section className="restaurant-banner">
            <img
              src={restaurant.profile_url}
              alt={restaurant.restaurant_name}
              className="banner-image img-fluid"
            />
          </section>
          <div className="row mt-4">
            <div className="col-lg-4 col-md-12">
              <div className="restaurant-info-container">
                <h2 className="restaurant-name">{restaurant.restaurant_name}</h2>
                <div className="restaurant-details d-flex flex-wrap align-items-center">
                  <span className="restaurant-rating">
                    {restaurant.rating} <span className="star">★</span> ({restaurant.totalReviews}+)
                  </span>
                  <span className="ml-3">{restaurant.price_range}</span>
                  {restaurant.uberone && (
                    <span className="uber-one ml-3 d-flex align-items-center">
                      <img src="/path-to-uber-one-icon.png" alt="Uber One" className="uber-one-icon mr-1" />
                      Uber One
                    </span>
                  )}
                  <a href="/info" className="info-link ml-3">Info</a>
                </div>
                <div className="delivery-info mt-3">
                  <span className="delivery-icon">🚚</span> {restaurant.deliveryInfo}
                </div>
              </div>
              <div className="sticky-menu mt-4">
                <Menu categories={Object.keys(groupedItems)} activeCategory={activeCategory} />
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <OrderOptions />
              {Object.entries(groupedItems).map(([category, items], index) => {
                const ref = React.createRef();
                categoryRefs.current[category] = ref;

                return (
                  <div key={index} className="menu-group mt-4" ref={ref}>
                    <h2>{category}</h2>
                    <div className="row">
                      {items.map((item, itemIndex) => (
                        <div className="col-md-6 col-lg-4" key={itemIndex}>
                          <MenuItem menu={item} restaurantid = {id} restaurantname={restaurant.restaurant_name}/>
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
  );
};

export default Restaurant;
