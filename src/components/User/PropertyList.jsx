import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../../contexts/PropertyContext';
import SearchFilter from './SearchFilter';

const PropertyList = () => {
  const { properties, fetchProperties, searchProperties, loading } = useProperty();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    searchProperties(newFilters);
  };

  const handlePropertyClick = (id) => {
    navigate(`/properties/${id}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const classes = {
      available: 'status-badge status-available',
      sold: 'status-badge status-sold',
      pending: 'status-badge status-pending'
    };
    const labels = {
      available: 'Còn trống',
      sold: 'Đã bán',
      pending: 'Đang chờ'
    };
    return <span className={classes[status]}>{labels[status]}</span>;
  };

  const getTypeLabel = (type) => {
    const labels = {
      land: 'Đất nền',
      house: 'Nhà ở',
      apartment: 'Căn hộ',
      commercial: 'Thương mại'
    };
    return labels[type] || type;
  };

  return (
    <div className="property-page">
      <div className="page-header">
        <h1 className="page-title">Danh Sách Bất Động Sản</h1>
      </div>

      <SearchFilter filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">🏠</div>
          <h3>Không Tìm Thấy Bất Động Sản</h3>
          <p>Hãy thử điều chỉnh bộ lọc tìm kiếm.</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map(property => (
            <div 
              key={property.id} 
              className="property-card"
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="property-image">
                🏠
              </div>
              <div className="property-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`property-type-badge badge-${property.type}`}>
                    {getTypeLabel(property.type)}
                  </span>
                  {getStatusBadge(property.status)}
                </div>
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">📍 {property.location}</p>
                <div className="property-details">
                  <span className="property-detail">📐 {property.area.toLocaleString()} m²</span>
                </div>
                <p className="property-price">{formatCurrency(property.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;