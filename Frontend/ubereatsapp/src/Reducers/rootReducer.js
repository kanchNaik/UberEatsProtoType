import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import restaurantReducer from './restaurantReducer';
import authReducer from './authReducer';
import ordersReducer from './ordersReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  restaurants: restaurantReducer,
  orders: ordersReducer,
});

export default rootReducer;
