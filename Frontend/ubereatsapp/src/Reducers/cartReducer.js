import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItemCount: 0,
    cartItems: [],
    restaurantId: null,
    restaurantName: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      const { items, reset, restaurantId, restaurantName } = action.payload;

      if (reset || state.restaurantId !== restaurantId) {
        // If reset is true or the restaurant has changed, clear the cart and set the new items
        state.cartItems = items;
        state.restaurantId = restaurantId; 
        state.restaurantName = restaurantName// Update the restaurantId in the state
      } else {
        // If the same restaurant and no reset, update the existing cart items
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
    assignCartItemCount: (state, action) => {
      state.cartItemCount = action.payload;
    },
    clearCart: (state) => {
      // Clear the cart items, item count, and reset restaurant ID
      state.cartItems = [];
      state.cartItemCount = 0;
      state.restaurantId = null;
      state.restaurantName = null;
    },
  },
});

export const { setCartItems, assignCartItemCount, clearCart } = cartSlice.actions; // Exporting actions
export default cartSlice.reducer;
