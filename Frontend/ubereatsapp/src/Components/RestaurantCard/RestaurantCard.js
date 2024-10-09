import React from 'react';
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'
import './RestaurantCard.css'

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className='col-md-3'>
    <ImgTextCard
        maindivclass = "restaurantcard"
        txtdivclass = 'text-left restaurantcard-text'
        imgclass = 'img-fluid'
        imgsrc={restaurant.image}
        alttext= 'Feed Your Employees'>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '3vh'}}>
            <h5>{restaurant.name}</h5>
            <p>⭐ {restaurant.rating}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            {restaurant.uberone !== undefined && restaurant.uberone === true ? (<p>Uber One benifits apply</p>) : (<span/>)}
            <p>{restaurant.deliveryTime} min</p>
            </div>
    </ImgTextCard>
    </div>
  );
};

export default RestaurantCard;
