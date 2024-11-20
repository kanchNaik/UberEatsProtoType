import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Feed.css';
import CategoryCarousel from '../Carousel/CategoryCarousel';
import Filter from '../Common/Filter/Filter'; // Import the Filter component
import RestaurantCard from '../RestaurantCard/RestaurantCard'; // Import the RestaurantCard component
import { messageService } from '../Common/Message/MessageService';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurantsAndFavorites } from '../../actions';
import { selectRestaurantList } from '../../Reducers/selectors';

const allFilters = [
  "Uber One",
  "Offers",
  "Under 30 min",
  "Best Overall",
  "Rating",
  "Price",
  "Dietary"
];

const dropdownFilters = [
  "Rating",
  "Price",
  "Dietary"
];

const Feed = () => {
  const [selectedFilter, setSelectedFilter] = useState("All"); // Track selected filter
  const [selectedDropdown, setSelectedDropdown] = useState({ rating: "", price: "", dietary: "" }); // Track dropdown selections

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRestaurantsAndFavorites());
  }, [dispatch]);

  const restaurantList = useSelector(state => state.restaurants.list.data);

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSelectDropdown = (filter, value) => {
    setSelectedDropdown((prev) => ({ ...prev, [filter.toLowerCase()]: value }));
  };

  // Ensure filteredRestaurants is computed using useMemo
  const filteredRestaurants = useMemo(() => {
    return restaurantList.filter((restaurant) => {
      // Apply selected filter conditions
      if (selectedFilter === "Under 30 min" && !restaurant.deliveryTime.includes('30 min')) return false;
      if (selectedFilter === "Best Overall" && restaurant.rating < 4.5) return false;

      // Apply dropdown filters
      if (selectedDropdown.rating && restaurant.rating < selectedDropdown.rating) return false;
      if (selectedDropdown.price && restaurant.price !== selectedDropdown.price) return false;

      // Add dietary filtering logic here if applicable
      return true; // Include restaurant if all conditions pass
    });
  }, [restaurantList, selectedFilter, selectedDropdown]); // Recompute when dependencies change

  // Show loading message while fetching
  if (!restaurantList.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App container">
      {/* Categories */}
      <CategoryCarousel />

      {/* Filters */}
      <Filter
        filters={allFilters}
        onSelectFilter={handleSelectFilter}
        selectedFilter={selectedFilter}
        dropdownFilters={dropdownFilters}
        onSelectDropdown={handleSelectDropdown}
        selectedDropdown={selectedDropdown}
      />

      {/* Featured Restaurants */}
      <div className="container-fluid featured-restaurants py-5">
        <h4>Featured on Uber Eats</h4>
        <div className="row">
          {filteredRestaurants.map((restaurant) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
