// reducers.js
import {
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_RESTAURANT_DETAILS_SUCCESS,
  FETCH_RESTAURANT_MENU_SUCCESS,
} from '../actionType';

const initialState = {
  list: {
    data: [],
    lastFetched: null,
  },
  details: {}, // { [id]: { data: { ...details }, lastFetched: timestamp } }
  menus: {},   // { [id]: { data: [...menuItems], lastFetched: timestamp } }
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        list: {
          data: action.payload,
          lastFetched: Date.now(),
        },
      };

    case FETCH_RESTAURANT_DETAILS_SUCCESS:
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload.id]: {
            data: action.payload.data,
            lastFetched: Date.now(),
          },
        },
      };

    case FETCH_RESTAURANT_MENU_SUCCESS:
      return {
        ...state,
        menus: {
          ...state.menus,
          [action.payload.id]: {
            data: action.payload.data,
            lastFetched: Date.now(),
          },
        },
      };

    default:
      return state;
  }
};

export default restaurantReducer;
