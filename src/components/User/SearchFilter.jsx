import React from 'react';

const SearchFilter = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      keyword: '',
      type: 'all',
      status: 'all',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="search-filter-section">
      <div className="search-filter-form">
        <div className="form-group">
          <label>Search</label>
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search by title or location..."
            />
          </div>
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="land">Land</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            className="filter-select"
          />
        </div>

        <div className="form-group">
          <label>Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
            className="filter-select"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;