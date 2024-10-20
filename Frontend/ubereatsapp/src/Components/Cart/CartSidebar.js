import React, { useState } from 'react';
import './CartSidebar.css'; // Change to the new CSS file for the sidebar

const CartSidebar = ({ closeCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleNoteChange = (e) => setSpecialNote(e.target.value);

  return (
    <div className="sidebar-overlay">
      <div className="sidebar-content">
        <button className="close-btn" onClick={closeCart}>
          &times;
        </button>

        <h2>Thaibodia Bistro</h2>
        <p>1 item</p>
        <hr />

        <div className="item-details">
          <h3>50 - PAD THAI</h3>
          <p>
            Make it with (41, 50, 52): Vegan Tofu (No Egg) <br />
            Spicy level (Non - Hot): Non-Spicy <br />
            Peanut Option 1: Peanut
          </p>

          <div className="quantity-section">
            <label htmlFor="quantity">Qty:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <p>${(16.95 * quantity).toFixed(2)}</p>
          </div>
        </div>

        <div className="order-note">
          <label htmlFor="specialNote" className='order-note label'><h6>Add an order note:</h6></label>
          <textarea
            id="specialNote"
            placeholder="Utensils, special instructions, etc."
            value={specialNote}
            onChange={handleNoteChange}
            className='order-note textarea'
          />
        </div>

        <hr />

        <div className="subtotal-section">
          <h6>Subtotal</h6>
          <p>${(16.95 * quantity).toFixed(2)}</p>
        </div>

        <div className="button-container">
          <button className="checkout-btn">Go to checkout</button>
          <button className="add-items-btn" onClick={closeCart}>
            Add items
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
