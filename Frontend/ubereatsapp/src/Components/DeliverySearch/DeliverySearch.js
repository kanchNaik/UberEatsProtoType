import React from 'react'
import SearchContainer from '../Common/Search/SearchContainer'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearchLocation, FaClock } from 'react-icons/fa'; 
import './DeliverySearch.css'
import PropTypes from 'prop-types'; 

const DeliverySearch = () => {

    const handleSearch = (query) => {
        // Here, you can handle the search logic, such as calling an API or filtering results.
        console.log('Searching for:', query);
      };

  return (
    <SearchContainer  handleSearch={handleSearch}>
      {/* Address Input */}
      <div className="delivery-input">
        <FaSearchLocation className="search-icon" />
        <input
          type="text"
          placeholder="Enter delivery address"
          className="address-input"
        />
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
  )
}

export default DeliverySearch