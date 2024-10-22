import React, { useState } from 'react';
import CartIcon from '../Common/Cart/CartIcon';
import CartSidebar from '../Cart/CartSidebar';
import './FeedNavbar.css';

function FeedNavbar({ onClick, user, itemCount }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light feed-navbar">
            <div className="container-fluid">
                {/* Hamburger Menu Icon */}
                <button type="button" className='navbarmenue' onClick={onClick}>
                    <i className="bi bi-list hamberger-icon"></i>
                </button>

                {/* Brand Name */}
                <a className="navbar-brand" href="/">Uber Eats</a>

                {/* Delivery & Pickup Options */}
                <div className="navbar-options">
                    <a className="nav-link" href="/">Delivery</a>
                    <a className="nav-link" href="/">Pickup</a>
                </div>

                {/* Location */}
                <div className="location-select">
                    <a className="nav-link" href="/">San Jose Diridon VTA Bus</a>
                </div>

                {/* Search */}
                <form className="search-form">
                    <input 
                        className="form-control" 
                        type="search" 
                        placeholder="Search Uber Eats" 
                        aria-label="Search"
                    />
                </form>

                {/* Cart Icon */}
                <button className="cart-button" onClick={openCart}>
                    <CartIcon itemCount={itemCount} />
                </button>
            </div>

            {/* Sidebar for Cart */}
            {isCartOpen && <CartSidebar closeCart={closeCart} />}
        </nav>
    );
}

export default FeedNavbar;
