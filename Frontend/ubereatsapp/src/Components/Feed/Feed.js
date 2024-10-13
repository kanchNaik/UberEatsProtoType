import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Feed.css';
import CategoryCarousel from '../Carousel/CategoryCarousel';
import Filter from '../Common/Filter/Filter'; // Import the Filter component
import RestaurantCard from '../RestaurantCard/RestaurantCard'; // Import the RestaurantCard component
import { NavLink, useLocation } from 'react-router-dom';

const featuredRestaurants = [
  { id: 1, name: "Domino's", rating: 4.4, image: `${process.env.PUBLIC_URL}/Assets/dominos.webp`, deliveryTime: "35-45 min", price: "medium", uberone: true },
  { id: 2, name: "Chipotle", rating: 4.7, image: `${process.env.PUBLIC_URL}/Assets/chipotle.webp`, deliveryTime: "25-30 min", price: "low", uberone: true  },
  { id: 3, name: "Five Guys", rating: 4.7, image: `${process.env.PUBLIC_URL}/Assets/fiveguys.webp`, deliveryTime: "15-30 min", price: "high" },
  { id: 4, name: "Jack In The Box", rating: 4.6, image: `${process.env.PUBLIC_URL}/Assets/jackinthebox.webp`, deliveryTime: "15-30 min", price: "medium", uberone: true }
];

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

  const [filteredRestaurants, setFilteredRestaurants] = useState(featuredRestaurants);
  const [selectedFilter, setSelectedFilter] = useState("All"); // Track selected filter
  const [selectedDropdown, setSelectedDropdown] = useState({ rating: "", price: "", dietary: "" }); // Track dropdown selections

  const { location: selectedLocation } = location.state || {}

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter); // Set the selected filter

    // Implement your filtering logic here
    switch (filter) {
      case "Under 30 min":
        setFilteredRestaurants(featuredRestaurants.filter(restaurant => restaurant.deliveryTime.includes('30 min')));
        break;
      case "Best Overall":
        setFilteredRestaurants(featuredRestaurants.filter(restaurant => restaurant.rating >= 4.5));
        break;
      default:
        setFilteredRestaurants(featuredRestaurants);
    }
  };

  const handleSelectDropdown = (filter, value) => {
    setSelectedDropdown((prev) => ({ ...prev, [filter.toLowerCase()]: value })); // Update the selected dropdown value

    // Implement filtering logic based on dropdown selection
    let updatedRestaurants = featuredRestaurants;

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
        <div className="d-flex justify-content-between">
          {filteredRestaurants.map((restaurant, index) => (
            <NavLink to = {`/restaurant/${restaurant.id}`}>
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
