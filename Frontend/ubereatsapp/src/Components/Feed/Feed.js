import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Feed.css';
import CategoryCarousel from '../Carousel/CategoryCarousel';
import Filter from '../Common/Filter/Filter'; // Import the Filter component
import RestaurantCard from '../RestaurantCard/RestaurantCard'; // Import the RestaurantCard component
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

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
  const [restaurants, setRestaurants] = useState([]); // All restaurants with favorite flag
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Filtered restaurants
  const [selectedFilter, setSelectedFilter] = useState("All"); // Track selected filter
  const [selectedDropdown, setSelectedDropdown] = useState({ rating: "", price: "", dietary: "" }); // Track dropdown selections

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
        setFilteredRestaurants(restaurants); // Reset to fetched data
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
    const fetchRestaurantsAndFavorites = async () => {
      try {
        // Fetch restaurants
        const restaurantResponse = await axios.get(`${BASE_API_URL}/api/restaurants`, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          withCredentials: true, // Enable sending cookies with the request
        });

        const fetchedRestaurants = restaurantResponse.data; // Assuming response.data is the array of restaurants

        // Fetch favorites
        const favoriteResponse = await axios.get(`${BASE_API_URL}/api/favorite/`, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          withCredentials: true,
        });

        // Map the favorite restaurants and extract both favorite id and restaurant_id
        const favoriteData = favoriteResponse.data.map(entry => ({
          favoriteId: entry.id, // The id of the favorite entry
          restaurantId: entry.restaurant.restaurant_id, // The id of the restaurant
        }));

        const favoriteIds = favoriteData.map(fav => fav.restaurantId);

        // Mark restaurants as favorite based on favoriteIds and include the favoriteId
        const updatedRestaurants = fetchedRestaurants.map(restaurant => {
          const favoriteEntry = favoriteData.find(fav => fav.restaurantId === restaurant.id);
          return {
            ...restaurant,
            isFavorite: favoriteEntry !== undefined, // Set favorite flag
            favoriteId: favoriteEntry ? favoriteEntry.favoriteId : null, // Store the favorite entry's id, if it exists
          };
        });

        // Set state with the updated restaurant list
        setRestaurants(updatedRestaurants); // Set full restaurant list with favorite flag and favoriteId
        setFilteredRestaurants(updatedRestaurants); // Initialize filtered list with all restaurants
      } catch (error) {
        console.error('Error fetching data:', error);
        messageService.showMessage('error', 'Sorry, Could not find any restaurants near you!');
      }
    };

    fetchRestaurantsAndFavorites();
  }, []); // Run on component mount

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
        selectedDropdown={selectedDropdown} // Pass selectedDropdown state
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
