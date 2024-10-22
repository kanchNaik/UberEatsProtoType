// reducers/cartReducer.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItemCount: 0,
    cartItems: [], // Array to hold cart items
  },
  reducers: {
    setCartItems: (state, action) => {
      // Check for the reset flag in the payload
      const { items, reset } = action.payload; // Destructure items and reset flag

      if (reset) {
        // If reset is true, directly assign the new items
        state.cartItems = items;
      } else {
        // If reset is false, add new items to the existing cart items
        const existingItems = state.cartItems;

        // Create a map of existing items for easier updating
        const existingItemMap = Object.fromEntries(existingItems.map(item => [item.id, item]));

        items.forEach(newItem => {
          if (existingItemMap[newItem.id]) {
            // If the item already exists, update the quantity
            existingItemMap[newItem.id].quantity += newItem.quantity;
          } else {
            // Otherwise, add the new item
            existingItems.push({ ...newItem });
          }
        });

        // Assign the updated cartItems back to state
        state.cartItems = existingItems;
      }

      // Calculate total quantity from the items and update cartItemCount
      state.cartItemCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    // Optionally, you can add other actions here in the future
    assignCartItemCount: (state, action) => {
      state.cartItemCount = action.payload; // Just in case you need it in the future
    },
  },
});

export const { setCartItems, assignCartItemCount } = cartSlice.actions; // Exporting both actions
export default cartSlice.reducer;
