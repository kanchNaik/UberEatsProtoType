import React from 'react';
import './OrderCard.css'; // External CSS for styling
import { NavLink } from 'react-router-dom';
import { parseDate } from '../../Utilities/DateUtils'

const OrderCard = ({ order }) => {
    return (
        <div className="order-card">
            <div className="order-header">
                <h3 className="restaurant-name">{order.restaurant_name}</h3>
                <img
                    src="partner-logo.png"
                    alt="Partner Logo"
                    className="partner-logo"
                />
            </div>

            <div className="order-details">
                <p className="order-info">
                    {parseDate(order.created_at)} • ${order.total_price} • {order.item_count} items
                </p>
                <p>
                    {order.delivery_address}
                </p>
            </div>

            <div className="review-section">
                <div className="stars">
                    {Array(5).fill(0).map((_, index) => (
                        <span key={index} className="star">☆</span>
                    ))}
                </div>
                <a href="#" className="review-link">Leave a review</a>
            </div>
            <div><NavLink to={`/restaurant/${order.restaurant}`}>Go to Restaurant</NavLink></div>
        </div>
    );
};

export default OrderCard;
