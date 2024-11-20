
import axios from 'axios';
import Cookies from 'js-cookie';
import { setCartItems } from '../../actions';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

export const fetchCartData = async (dispatch) => {
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

    dispatch(setCartItems({ items: formattedItems, restaurantId: response.data.restaurant_id, reset: true })); // Dispatch action to update Redux store with formatted items
  } catch (error) {
    console.error('Error fetching cart data:', error);
    messageService.showMessage('error', 'Error in fetching cart')
  }
};
