export const selectRestaurantList = (state) => {
    return state.restaurants.list || []; // Assuming restaurants.list holds the restaurant data
  };