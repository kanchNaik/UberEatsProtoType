import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_API_URL } from './Setupconstants';

import { INCREMENT_CART_ITEM_COUNT, 
  ASSIGN_CART_ITEM_COUNT,
  SET_CART_ITEMS,
  CLEAR_CART,
  SET_AUTH_TOKEN, 
  CLEAR_AUTH_TOKEN,
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_RESTAURANTS_FAILURE,
  FETCH_RESTAURANT_DETAILS_SUCCESS,
  FETCH_RESTAURANT_DETAILS_FAILURE,
  FETCH_RESTAURANT_MENU_SUCCESS,
  FETCH_RESTAURANT_MENU_FAILURE
} from './actionType';


const ONE_HOUR = 60 * 60 * 1000;


// Action creator for incrementing cart item count
export const incrementCartItemCount = (quantity) => ({
    type: INCREMENT_CART_ITEM_COUNT,
    payload: quantity, // Pass the quantity as payload
  });

// Action creator for assigning cart item count
export const assignCartItemCount = (count) => ({
  type: ASSIGN_CART_ITEM_COUNT,
  payload: count,
});

export const setCartItems = (items, reset = false, restaurantId = null, restaurantName = null) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return {
    type: SET_CART_ITEMS,
    payload: { items: safeItems, reset, restaurantId, restaurantName },
  };
};

export const clearCart = () => ({
  type: CLEAR_CART,
});



// Action creator for setting the authentication token
export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: token,
});

// Action creator for clearing the authentication token
export const clearAuthToken = () => ({
  type: CLEAR_AUTH_TOKEN,
});


export const fetchRestaurantsAndFavorites = () => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const token = auth.token;
    // Fetch restaurants
    const restaurantResponse = await axios.get(`${BASE_API_URL}/api/restaurants`, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const fetchedRestaurants = restaurantResponse.data;

    // Fetch favorites
    const favoriteResponse = await axios.get(`${BASE_API_URL}/api/favorite/`, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const favoriteData = favoriteResponse.data.map(entry => ({
      favoriteId: entry.id,
      restaurantId: entry.restaurant.restaurant_id,
    }));

    const favoriteIds = favoriteData.map(fav => fav.restaurantId);

    // Combine data to mark favorites
    const updatedRestaurants = fetchedRestaurants.map(restaurant => {
      const favoriteEntry = favoriteData.find(fav => fav.restaurantId === restaurant.id);
      return {
        ...restaurant,
        isFavorite: !!favoriteEntry, // Set true if favoriteEntry exists
        favoriteId: favoriteEntry ? favoriteEntry.favoriteId : null,
      };
    });

    // Dispatch success action
    dispatch({
      type: FETCH_RESTAURANTS_SUCCESS,
      payload: updatedRestaurants,
    });
  } catch (error) {
    console.error('Error fetching restaurants or favorites:', error);
    dispatch({
      type: FETCH_RESTAURANTS_FAILURE,
      payload: error.message,
    });
  }
};

// Fetch restaurant details
export const fetchRestaurantDetails = (id) => async (dispatch, getState) => {
  const { restaurants, auth } = getState();
  const token = auth.token;
  const details = restaurants.details[id];

  if (details?.lastFetched && Date.now() - details.lastFetched < ONE_HOUR) {
    // Data is fresh; no need to fetch again
    return;
  }

  try {
    const response = await axios.get(`${BASE_API_URL}/api/restaurants/${id}`, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    dispatch({
      type: FETCH_RESTAURANT_DETAILS_SUCCESS,
      payload: { id, data: response.data },
    });
  } catch (error) {
    dispatch({
      type: FETCH_RESTAURANT_DETAILS_FAILURE,
      payload: error.message,
    });
  }
};

// Fetch restaurant menu
export const fetchRestaurantMenu = (id) => async (dispatch, getState) => {
  const { restaurants, auth } = getState();
  const token = auth.token;
  const menu = restaurants.menus[id];

  if (menu?.lastFetched && Date.now() - menu.lastFetched < ONE_HOUR) {
    // Data is fresh; no need to fetch again
    return;
  }

  try {
    const response = await axios.get(`${BASE_API_URL}/api/restaurants/${id}/dishes`, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    dispatch({
      type: FETCH_RESTAURANT_MENU_SUCCESS,
      payload: { id, data: response.data },
    });
  } catch (error) {
    dispatch({
      type: FETCH_RESTAURANT_MENU_FAILURE,
      payload: error.message,
    });
  }
};


