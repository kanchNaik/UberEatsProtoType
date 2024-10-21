import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Feed.css';
import CategoryCarousel from '../Carousel/CategoryCarousel';
import Filter from '../Common/Filter/Filter'; // Import the Filter component
import RestaurantCard from '../RestaurantCard/RestaurantCard'; // Import the RestaurantCard component
import { NavLink, useLocation } from 'react-router-dom';
import { getUserInfo } from '../../Utilities/UserUtils';
import Cookies from 'js-cookie';
import axios from 'axios';

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
  const location = useLocation();
  const userInfo = getUserInfo();
  
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Initialize with an empty array
  const [selectedFilter, setSelectedFilter] = useState("All"); // Track selected filter
  const [selectedDropdown, setSelectedDropdown] = useState({ rating: "", price: "", dietary: "" }); // Track dropdown selections

  const { location: selectedLocation } = location.state || {}

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter); // Set the selected filter

    // Implement your filtering logic here
    switch (filter) {
      case "Under 30 min":
        setFilteredRestaurants(prev => prev.filter(restaurant => restaurant.deliveryTime.includes('30 min')));
        break;
      case "Best Overall":
        setFilteredRestaurants(prev => prev.filter(restaurant => restaurant.rating >= 4.5));
        break;
      default:
        setFilteredRestaurants(filteredRestaurants); // Reset to fetched data
    }
  };

  const handleSelectDropdown = (filter, value) => {
    setSelectedDropdown((prev) => ({ ...prev, [filter.toLowerCase()]: value })); // Update the selected dropdown value

    // Implement filtering logic based on dropdown selection
    let updatedRestaurants = filteredRestaurants;

    if (value) {
      if (filter === "Rating") {
        updatedRestaurants = updatedRestaurants.filter(restaurant => restaurant.rating >= value);
      } else if (filter === "Price") {
        updatedRestaurants = updatedRestaurants.filter(restaurant => restaurant.price === value);
      } else if (filter === "Dietary") {
        // Implement dietary filtering logic if applicable
      }
    }

    setFilteredRestaurants(updatedRestaurants);
  };

  useEffect(() => {
    // Function to fetch restaurant data
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/restaurants', {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          withCredentials: true, // Enable sending cookies with the request
        });

        // Update the state with the fetched restaurants
        setFilteredRestaurants(response.data); // Assuming response.data is the array of restaurants
      } catch (error) {
        // Handle errors here
        console.error('Error fetching restaurants:', error);
      }
    };

    // Call the fetch function
    fetchRestaurants();
  }, []);

  return (
    <div className="App container">
      {/* Categories */}
      <CategoryCarousel/>

      {/* Filters */}
      <Filter
        filters={allFilters}
        onSelectFilter={handleSelectFilter}
        selectedFilter={selectedFilter}
        dropdownFilters={dropdownFilters}
        onSelectDropdown={handleSelectDropdown}
        selectedDropdown={selectedDropdown} // Pass selectedDropdown state
      />

      {/* Featured Restaurants */}
      <div className="container-fluid featured-restaurants py-5">
        <h4>Featured on Uber Eats</h4>
        <div className="d-flex row">
          {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
