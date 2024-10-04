import React, { useState } from 'react';
import PropTypes from 'prop-types'; 

const SearchContainer = ({ children, handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Trigger search when the button is clicked
  const onSearchClick = () => {
    if (handleSearch) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="common-search-container">
      {/* Render children passed to this container */}
      {React.Children.map(children, child => {
        // If it's an input, inject the handleInputChange method
        if (child.props.placeholder === 'Enter delivery address') {
          return React.cloneElement(child, {
            onChange: handleInputChange,
            value: searchQuery
          });
        }
        return child;
      })}
      {/* Add the search button functionality */}
      <button className="search-button" onClick={onSearchClick}>Search here</button>
    </div>
  );
};


SearchContainer.propTypes = {
  children: PropTypes.node.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchContainer;
