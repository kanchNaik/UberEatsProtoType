import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import restaurantReducer from './restaurantReducer';
import authReducer from './authReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  restaurants: restaurantReducer,
});

export default rootReducer;
