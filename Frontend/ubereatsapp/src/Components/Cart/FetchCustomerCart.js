// src/utils/fetchCartData.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { setCartItems } from '../../Reducers/cartReducer'; // Adjust the path as necessary

export const fetchCartData = async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8000/api/cart/get_cart', {
      withCredentials: true, // Enable sending cookies with the request
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    });

    const items = response.data.items; // Assuming response.data.items contains the cart items

    // Map items to include only dish_id and quantity
    const formattedItems = items.map((item) => ({
      dish_id: item.dish_id, // Assuming item.dish_id is the dish ID
      quantity: item.quantity || 1, // Get the quantity or default to 1
    }));

    dispatch(setCartItems({ items: formattedItems, reset: true })); // Dispatch action to update Redux store with formatted items
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
};
