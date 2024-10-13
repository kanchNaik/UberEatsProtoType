import React, { useState } from 'react';
import SearchContainer from '../Common/Search/SearchContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearchLocation, FaClock } from 'react-icons/fa'; 
import './DeliverySearch.css';
import PropTypes from 'prop-types'; 

const DeliverySearch = ({onSelect, handleSearch}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Hardcoded HERE API Key
  const apiKey = 'jRADxMj8-Y0jZ61WeohyB8epfooc7RY9lFLc_zWwNq4'; // Replace with your actual HERE API Key

  // const handleSearch = (query) => {
  //   console.log('Searching for:', query);
  // };

  // Fetch suggestions from HERE Places API
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const url = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${apiKey}&q=${query}&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.items || []); // Ensure data.items exists
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    fetchSuggestions(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setSuggestions([]);  // Clear suggestions after selection
    onSelect(suggestion);
  };

  // Render the autocomplete suggestions
  const renderSuggestions = () => {
    return (
      suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <SearchContainer handleSearch={handleSearch}>
      {/* Address Input with Autocomplete */}
      <div className="delivery-input">
      <div className="input-group">
      <FaSearchLocation className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter delivery address"
          className="form-control"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions list-group">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="list-group-item suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <FaSearchLocation className="search-icon" />
              {suggestion.title}
              <div className="suggestion-address">{suggestion.vicinity}</div>
            </li>
          ))}
        </ul>
      )}
    </div>

      {/* Delivery Time Dropdown */}
      <div className="delivery-time-dropdown">
        <button className="dropdown-button">
          <FaClock className="clock-icon" /> Deliver now
        </button>
        {/* Dropdown menu */}
        <div className="dropdown-content">
          <div className="dropdown-item">Deliver now</div>
          <div className="dropdown-item">Schedule for later</div>
        </div>
      </div>
    </SearchContainer>
  );
};

DeliverySearch.propTypes = {
  handleSearch: PropTypes.func,
};

export default DeliverySearch;
