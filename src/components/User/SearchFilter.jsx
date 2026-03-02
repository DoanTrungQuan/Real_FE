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
          <label>Tìm Kiếm</label>
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Tìm theo tiêu đề hoặc địa điểm..."
            />
          </div>
        </div>

        <div className="form-group">
          <label>Loại Bất Động Sản</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="all">Tất Cả</option>
            <option value="land">Đất</option>
            <option value="house">Nhà</option>
            <option value="apartment">Căn Hộ</option>
            <option value="commercial">Thương Mại</option>
          </select>
        </div>

        <div className="form-group">
          <label>Trạng Thái</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="all">Tất Cả</option>
            <option value="available">Đang Bán</option>
            <option value="pending">Đang Chờ</option>
            <option value="sold">Đã Bán</option>
          </select>
        </div>

        <div className="form-group">
          <label>Giá Tối Thiểu</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Tối thiểu"
            className="filter-select"
          />
        </div>

        <div className="form-group">
          <label>Giá Tối Đa</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Tối đa"
            className="filter-select"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleReset}
          >
            Đặt Lại Bộ Lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;