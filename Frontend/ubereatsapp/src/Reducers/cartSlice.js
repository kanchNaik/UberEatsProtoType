// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartCount: 0,
  },
  reducers: {
    incrementCart: (state, action) => {
        debugger
      state.cartCount += action.payload || 1; // Increment by quantity or 1
    },
  },
});

export const { incrementCart } = cartSlice.actions;
export default cartSlice.reducer;
