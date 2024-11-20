import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartSidebar.css';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setCartItems } from '../../actions';
import { useNavigate  } from 'react-router-dom';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import {clearCart} from '../../actions'

const CartSidebar = ({ closeCart }) => {
  const [cartItems, setCartItemsState] = useState([]); 
  const [restaurantName, setRestaurantName] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch();

 
  const fetchCartData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/cart/get_cart`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });
      const items = response.data.items; 

      
      const formattedItems = items.map((item) => ({
        dish_id: item.dish_id, 
        quantity: item.quantity || 1,
      }));

      setCartItemsState(items); 
      dispatch(setCartItems({ items: formattedItems, restaurantId: response.data.restaurant_id, reset: true })); // Dispatch action to update Redux store with formatted items
    } catch (error) {
      messageService.showMessage('error', 'Error ins fetching cart');
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchCartData(); 
  }, []);

  const handleQuantityChange = (id, event) => {
    const value = parseInt(event.target.value); 
    if (value >= 1) {
      setCartItemsState((prevItems) =>
        prevItems.map((item) =>
          item.dish_id === id ? { ...item, quantity: value } : item
        )
      );
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0).toFixed(2);
  };

 
  const getFormattedItems = () => {
    return cartItems.map((item) => ({
      dish_id: item.dish_id, 
      quantity: item.quantity || 1, 
    }));
  };

  
  const handleCheckout = async () => {
    try {
      const formattedItems = cartItems.map((item) => ({
        dish_id: item.dish_id, 
        quantity: item.quantity || 1, 
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
              },
              withCredentials: true, 
          }
      );
      
      console.log('Response:', response.data);
      closeCart()
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
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

     
      setCartItemsState([]);
      dispatch(clearCart());
      messageService.showMessage('success', 'Cleared cart succefully')
      closeCart() 
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

        <h2>Thaibodia Bistro</h2>
        <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        <hr />

        {cartItems.map((item) => (
          <div key={item.dish_id} className="item-details"> 
            <h3>{item.dish_name}</h3> 
            <p>{item.description}</p> 

            <div className="quantity-section">
              <label htmlFor={`quantity-${item.dish_id}`}>Qty:</label>
              <select
                id={`quantity-${item.dish_id}`}
                value={item.quantity || 1} 
                onChange={(e) => handleQuantityChange(item.dish_id, e)} 
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <p>${(item.price * (item.quantity || 1)).toFixed(2)}</p> 
            </div>
          </div>
        ))}

        <hr />

        <div className="subtotal-section">
          <h6>Subtotal</h6>
          <p>${calculateSubtotal()}</p> 
        </div>

        <div className="button-container">
        <button className="checkout-btn" onClick={handleCheckout}>Go to checkout</button>
        <button className="checkout-btn" onClick={handleClearCart}>Clear Cart</button>  
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
