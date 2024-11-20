import { SET_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from '../actionType';

const initialState = {
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case CLEAR_AUTH_TOKEN:
      return {
        ...state,
        token: null,
      };

    default:
      return state;
  }
};

export default authReducer;
