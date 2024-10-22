// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Reducers/cartReducer'; // Adjust path as needed

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add other reducers here if necessary
  },
});

export default store;
