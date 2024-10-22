// actions.js
import { INCREMENT_CART_ITEM_COUNT, ASSIGN_CART_ITEM_COUNT } from './actionType';

debugger;
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
