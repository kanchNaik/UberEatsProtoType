import React from 'react';
import './Restaurant.css';

import OrderOptions from '../OrderOptions/OrderOptions'
import Menu from '../Menu/Menu'

const restaurant = { id: 1, name: "Domino's", rating: 4.4, 
    image: `${process.env.PUBLIC_URL}/Assets/dominos.webp`, 
    bannerImage: `${process.env.PUBLIC_URL}/Assets/dominosBanner.jpeg`,
    deliveryTime: "35-45 min", price: "medium", uberone: true,
    deliveryInfo:'Delivery done by staff', totalReviews:100 };

const  menuCategories= ['Featured Items', 'Picked for you', 'Small Plates'];
const  featuredItems= [
      { name: 'Sushi Roll', label: '#1 Most Liked', image: 'path/to/item1.jpg' },
      { name: 'Sashimi', label: '#2 Most Liked', image: 'path/to/item2.jpg' },
      { name: 'Tempura', label: '#3 Most Liked', image: 'path/to/item3.jpg' }
    ];

const Restaurant = () => {
  return (
    <div className="restaurant-container">
      {/* Header Section */}
      {/* <header className="header">
        <div className="header-left">
          <div className="logo">Uber Eats</div>
          <div className="location">
            <i className="location-icon">📍</i>
            <span>San Jose Diridon Station - Now</span>
          </div>
        </div>
        <div className="header-right">
          <input className="search-bar" type="text" placeholder="Search Uber Eats" />
          <div className="cart-icon">🛒</div>
        </div>
      </header>
    
      {/* Restaurant Banner */}

      <div className='container'>
        <section className="restaurant-banner">
            <img
            src={restaurant.bannerImage}
            alt={restaurant.name}
            className="banner-image"
            />
        </section>
        <div style={{display:'flex'}}>
            <div style={{display:'block', flexBasis: '25%'}}>
            {/* Restaurant Details */}
            <div className="restaurant-info-container">
            <h2 className="restaurant-name">{restaurant.name}</h2>
            <div className="restaurant-details">
                <span className="restaurant-rating">
                {restaurant.rating} <span className="star">★</span> ({restaurant.totalReviews}+)
                </span>
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
            <Menu/>

                {/* <div className="menu-items">
                <h2>Featured Items</h2>
                <div className="menu-items-grid">
                    {featuredItems.map((item, index) => (
                    <div className="menu-item" key={index}>
                        <img src={item.image} alt={item.name} />
                        <p>{item.label}</p>
                    </div>
                    ))}
                </div>
                </div> */}
            </div>
            <div style={{display:'block', flexBasis: '75%', width:'100%'}}>
                <OrderOptions/>
            </div>
        </div>
    </div>
    </div>
  );
};

export default Restaurant;
