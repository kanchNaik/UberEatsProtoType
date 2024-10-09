import React from 'react';

const Filter = ({ filters, onSelectFilter, selectedFilter, dropdownFilters, onSelectDropdown, selectedDropdown }) => {
  return (
    <div className="filters container-fluid d-flex justify-content-around py-2">
      {filters.map((filter) => {
        if (dropdownFilters.includes(filter)) {
          return (
            <div key={filter} className="dropdown">
              <label className="me-2">{filter}:</label>
              <select 
                className="form-select" 
                value={selectedDropdown[filter.toLowerCase()]} 
                onChange={(e) => onSelectDropdown(filter, e.target.value)}
              >
                <option value="">Select</option>
                {filter === "Rating" && (
                  <>
                    <option value="4">4 Stars and above</option>
                    <option value="4.5">4.5 Stars and above</option>
                    <option value="5">5 Stars</option>
                  </>
                )}
                {filter === "Price" && (
                  <>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </>
                )}
                {filter === "Dietary" && (
                  <>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten-Free</option>
                  </>
                )}
              </select>
            </div>
          );
        } else {
          return (
            <button
              key={filter}
              className={`btn rounded-pill d-flex align-items-center ${selectedFilter === filter ? 'btn-primary' : 'btn-light'}`} // Highlight selected filter
              onClick={() => onSelectFilter(filter)}
            >
              {filter}
            </button>
          );
        }
      })}
    </div>
  );
};

export default Filter;
