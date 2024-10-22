import React, { useState } from 'react';
import './MenuItemAddModal.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setCartItems } from '../../Reducers/cartReducer'; // Import the setCartItems action

const MenuItemAddModal = ({ item, closeModal }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch(); // Initialize Redux dispatcher

  const handleQuantityChange = (value) => {
    if (value >= 0) setQuantity(value); // Ensure quantity is non-negative
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:8000/api/cart/add_to_cart/',
        { dish_id: item.id, quantity: quantity },
        { 
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          withCredentials: true 
        }
      );
      console.log('Item added to cart:', response.data);
      console.log('Quantity', quantity);

      // Create the cart item object
      const cartItem = {
        ...item,
        quantity, // Set the quantity for the item
      };

      // Dispatch the setCartItems action to set the cart in Redux store
      dispatch(setCartItems({items: [{dish_id: item.id, quantity}], reset: false})); // Replace with logic to append to existing items if necessary
      closeModal(); // Close the modal
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2>{item.dish_name}</h2>
        <p>${item.price}</p>
        <p>{item.description}</p>

        {/* Quantity Control */}
        <div className="quantity-control">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 0}
          >
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="submit-btn"
          onClick={handleAddToCart}
          disabled={quantity === 0 || loading}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default MenuItemAddModal;
