import React from 'react';
import './Checkout.css'; // External CSS file for styles

const Checkout = () => {
    return (
        <div className="card">
            <div className="cart-summary">
                <h2>Cart summary (1 item)</h2>
            </div>

            <div className="item-details">
                <img src="pad-thai.jpg" alt="Pad Thai" className="item-image" />
                <div className="item-info">
                    <h3>50 - PAD THAI</h3>
                    <p>Make it with (41, 50, 52) : Vegan Tofu (No Egg)</p>
                    <p>Spicy level (Non - Hot): Non-Spicy</p>
                    <p>Peanut Option 1: Peanut</p>
                </div>
                <p className="price">$16.95</p>
            </div>

            <div className="promo-section">
                <a href="#">Add promo code</a>
            </div>

            <div className="order-total">
                <div className="total-row">
                    <span>Subtotal</span>
                    <span>$16.95</span>
                </div>
                <div className="total-row">
                    <span>Delivery Fee</span>
                    <span>$0.49</span>
                </div>
                <div className="total-row">
                    <span>Taxes & Other Fees</span>
                    <span>$7.72</span>
                </div>
            </div>

            <div className="total">
                Total: $25.16
            </div>

            <button className="place-order-btn" onClick={() => alert('Order placed!')}>
                Place Order
            </button>

            <div className="footer-text">
                If you're not around when the delivery person arrives, they'll leave the food at your door.
            </div>

        </div>
    );
};

export default Checkout;
