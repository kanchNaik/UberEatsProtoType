import React from 'react';
import './OrderOptions.css'; // For styling

const OrderOptions = () => {
  return (
    <div className="order-options-container">
      <div className="order-type">
        <button className="order-button active">Delivery</button>
        <button className="order-button">Pickup</button>
        <button className="order-button">Group order</button>
      </div>
    <div className="benefits-and-time">
          <span className="uber-one-info">Uber One benefits apply on $15+ <span className="info-icon">i</span></span>
          <span className="delivery-time">30–50 min <span className="delivery-label">Delivery time</span></span>
    </div>
      </div>
  );
};

export default OrderOptions;
