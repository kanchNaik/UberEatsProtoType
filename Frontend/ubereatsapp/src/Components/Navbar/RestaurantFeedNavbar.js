import React from 'react'
import './RestaurantFeedNavbar.css'
import { useLocation, useNavigate } from 'react-router-dom';

function RestaurantFeedNavbar({onClick, user}) {
    const location = useLocation();
    const navigate = useNavigate();
    const onAddClick = () => navigate('/restaurant/dish/add')

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light feed-navbar">
            <div className="container-fluid" style={{justifyContent:'space-between'}}>
                <div>
                {/* Hamburger Menu Icon */}
                <button type="button" className='navbarmenue' onClick={onClick}>
                    <i className="bi bi-list hamberger-icon"></i>
                </button>

                {/* Brand Name */}
                <a className="navbar-brand" href="/">Uber Eats</a>
                </div>
                {(location.pathname == '/restaurant/dishes') && (<div style={{justifyContent:'end'}}>
                <button type="button" className='addDish' onClick={onAddClick}>
                    <i className="bi bi-plus"></i>
                    Add Dish
                </button>
                </div>)}
            </div>
        </nav>
  )
}

export default RestaurantFeedNavbar