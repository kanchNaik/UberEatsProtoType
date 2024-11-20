// action types
const SET_CART_ITEMS = 'SET_CART_ITEMS';
const CLEAR_CART = 'CLEAR_CART';

// Initial state for the cart
const initialState = {
  items: [],  // List of cart items
  reset: false,  // Whether the cart should be reset or not
  restaurantId: null,  // The ID of the restaurant from which the items are added
  restaurantName: null,  // The name of the restaurant
  count: 0,  // The total number of items in the cart
};

// Reducer function
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_ITEMS:
      let updatedItems;
      if (action.payload.reset) {
        updatedItems = action.payload.items; // Reset the items
      } else {
        updatedItems = [...state.items, ...action.payload.items]; // Append new items
      }
      
      // Calculate the new item count
      const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0); // Count based on quantity

      return {
        ...state,
        items: updatedItems,
        restaurantId: action.payload.restaurantId,
        restaurantName: action.payload.restaurantName,
        count: itemCount, // Set the count
      };

    case CLEAR_CART:
      // Reset cart and count
      return {
        ...state,
        items: [],
        restaurantId: null,
        restaurantName: null,
        count: 0, // Reset count
      };

    default:
      return state;
  }
};

export default cartReducer;
