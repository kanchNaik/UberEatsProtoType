import React, { useState } from 'react';
import './MenuItemAddModal.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setCartItems } from '../../actions'; 
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const MenuItemAddModal = ({ item, closeModal, restaurantid, restaurantname }) => {
  const [quantity, setQuantity] = useState(1); 
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch(); 
  const store_restaurantId = useSelector((state) => state.cart.restaurantId);
  const store_restaurantName = useSelector((state) => state.cart.restaurantName);
  const token = useSelector((state) => state.auth.token);

  const handleQuantityChange = (value) => {
    if (value >= 0) setQuantity(value); 
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/api/cart/add_to_cart/`,
        { dish_id: item.id, quantity: quantity },
        { 
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true 
        }
      );
      console.log('Item added to cart:', response.data);
      console.log('Quantity', quantity);
      messageService.showMessage('success', `Added ${quantity} items in cart`)

      // Create the cart item object
      const cartItem = {
        ...item,
        quantity, // Set the quantity for the item
      };

      // Dispatch the setCartItems action to set the cart in Redux store
      dispatch(setCartItems(
        [{ dish_id: item.id, quantity }], // Directly passing the array of items
        false,                            // reset flag
        restaurantid,                     // restaurantId
        restaurantname                    // restaurantName
      ));
      
      closeModal(); // Close the modal
    } catch (error) {
      console.error('Error adding to cart:', error);
      messageService.showMessage('error', 'Error in adding item in cart')
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleNewOrder = async () => {
    // User chooses to start a new order, reset the cart with the new restaurant's items
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/api/cart/add_to_cart/`,
        { dish_id: item.id, quantity: quantity },
        { 
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true 
        }
      );

      console.log('New order started, item added to cart:', response.data);
      messageService.showMessage('success', `New order started, item added to cart`)

      dispatch(setCartItems({
        items: [{ dish_id: item.id, quantity }],
        restaurantId: restaurantid,
        restaurantName: restaurantname,
        reset: true 
      }));

      closeModal(); 
    } catch (error) {
      console.error('Error starting new order:', error);
      messageService.showMessage('error', 'Error starting new order')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {(store_restaurantId && store_restaurantId !== restaurantid) ? (
        <div className="modal-content new-order-prompt">
          <h2>Create new order?</h2>
          <p>Your order contains items from {store_restaurantName}. Create a new order to add items from {restaurantname}.</p>
          <button className="new-order-btn" onClick={handleNewOrder}>
            New Order
          </button>
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MenuItemAddModal;
