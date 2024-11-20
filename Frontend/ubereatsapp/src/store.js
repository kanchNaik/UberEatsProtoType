// store.js
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct way to import thunk
import rootReducer from './Reducers/rootReducer'; // Import your combined reducers

// Create the Redux store
const store = createStore(
  rootReducer, // The root reducer
  applyMiddleware(thunk) // Apply the thunk middleware
);

export default store;
