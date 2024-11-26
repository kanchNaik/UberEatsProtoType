import { SET_ORDERS } from '../actionType';

const initialState = {
    list: [], // Default list of orders
    error: null, // Default error state
};

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {
                ...state,
                list: action.payload.orders,
                error: action.payload.error,
            };
        default:
            return state;
    }
};

export default ordersReducer;
