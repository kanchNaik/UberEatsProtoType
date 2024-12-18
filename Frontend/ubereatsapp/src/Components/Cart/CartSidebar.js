import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartSidebar.css'; // Change to the new CSS file for the sidebar
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../../actions';
import { useNavigate  } from 'react-router-dom';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import {clearCart} from '../../actions'

const CartSidebar = ({ closeCart }) => {
  const [cartItems, setCartItemsState] = useState([]); 
  const [restaurantName, setRestaurantName] = useState('')// Local state for cart items
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Function to fetch cart data
  const fetchCartData = async () => {
    
    try {
      const response = await axios.get(`${BASE_API_URL}/api/cart/get_cart`, {
        withCredentials: true, // Enable sending cookies with the request
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Bearer ${token}`,
        },
      });
      const items = response.data.items; // Assuming response.data.items contains the cart items
      const restaurantName = response.data.restaurant_name; // Assuming response.data.restaurant_name contains the restaurant name

      // Map items to include only dish_id and quantity
      const formattedItems = items.map((item) => ({
        dish_id: item.dish_id, // Assuming item.id is the dish ID
        quantity: item.quantity || 1, // Get the quantity or default to 1
      }));

      setCartItemsState(items); // Update local state
      setRestaurantName(restaurantName); // Set the restaurant name
      dispatch(setCartItems({ items: formattedItems, restaurantId: response.data.restaurant_id,restaurantName: restaurantName , reset: true })); // Dispatch action to update Redux store with formatted items
    } catch (error) {
      messageService.showMessage('error', 'Error ins fetching cart');
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchCartData(); // Fetch cart data when component mounts
  }, []);

  const handleQuantityChange = (id, event) => {
    const value = parseInt(event.target.value); // Get the value from the event directly
    // Ensure the quantity is a valid number
    if (value >= 1) {
      // Update cartItems directly
      setCartItemsState((prevItems) =>
        prevItems.map((item) =>
          item.dish_id === id ? { ...item, quantity: value } : item
        )
      );
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1)); // Calculate total for each item based on its quantity
    }, 0).toFixed(2);
  };

  // Function to get the formatted items
  const getFormattedItems = () => {
    return cartItems.map((item) => ({
      dish_id: item.dish_id, // Assuming item.id is the dish ID
      quantity: item.quantity || 1, // Get the quantity or default to 1
    }));
  };

  
  const handleCheckout = async () => {
    try {
      const formattedItems = cartItems.map((item) => ({
        dish_id: item.dish_id, // Assuming item.id is the dish ID
        quantity: item.quantity || 1, // Get the quantity or default to 1
      }));

      const response = await axios.post(
          `${BASE_API_URL}/api/cart/add_multiple_to_cart/`,
          {
            formattedItems
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': Cookies.get('csrftoken'),
                  'Authorization': `Bearer ${token}`,
              },
              withCredentials: true, // Ensure that cookies are included in the request
          }
      );
      
      console.log('Response:', response.data);
      closeCart() // Handle the response data here
      messageService.showMessage('success', 'Item succesfully added in cart')
      navigate('/order/checkout')
  } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      messageService.showMessage('error', 'Error adding item in cart')
  }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/api/cart/clear_cart/`, {
        withCredentials: true, // Enable sending cookies with the request
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Bearer ${token}`,
        },
      });

      // Clear local cartItems state
      setCartItemsState([]);
      dispatch(clearCart());
      messageService.showMessage('success', 'Cleared cart succefully')
      closeCart() // Dispatch to Redux to clear the cart
    } catch (error) {
      console.error('Error clearing the cart:', error);
      messageService.showMessage('success', 'Error in clearing cart')
    }
  }

  return (
    <div className="sidebar-overlay">
      <div className="sidebar-content">
        <button className="close-btn" onClick={closeCart}>
          &times;
        </button>

        <h2>{restaurantName}</h2>
        <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        <hr />

        {cartItems.map((item) => (
          <div key={item.dish_id} className="item-details"> {/* Use item.id for key */}
            <h3>{item.dish_name}</h3> {/* Assuming item has a dish_name property */}
            <p>{item.description}</p> {/* Assuming item has a description property */}

            <div className="quantity-section">
              <label htmlFor={`quantity-${item.dish_id}`}>Qty:</label>
              <select
                id={`quantity-${item.dish_id}`}
                value={item.quantity || 1} // Use individual quantity from item
                onChange={(e) => handleQuantityChange(item.dish_id, e)} // Pass the entire event
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <p>${(item.price * (item.quantity || 1)).toFixed(2)}</p> {/* Calculate price per item */}
            </div>
          </div>
        ))}

        <hr />

        <div className="subtotal-section">
          <h6>Subtotal</h6>
          <p>${calculateSubtotal()}</p> {/* Display calculated subtotal */}
        </div>

        <div className="button-container">
        <button className="checkout-btn" onClick={handleCheckout}>Go to checkout</button>
        <button className="checkout-btn" onClick={handleClearCart}>Clear Cart</button>  {/* Button to clear cart */}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
