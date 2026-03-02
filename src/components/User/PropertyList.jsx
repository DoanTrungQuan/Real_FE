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
              {/* Image */}
              <div className="property-image">
                <img
                  src={property.image || property.images?.[0] || '/placeholder.jpg'}
                  alt={property.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
              </div>

              <div className="property-content">
                {/* Type + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`property-type-badge badge-${property.type}`}>
                    {getTypeLabel(property.type)}
                  </span>
                  {getStatusBadge(property.status)}
                </div>

                {/* Title */}
                <h3 className="property-title">{property.title}</h3>

                {/* Location */}
                <p className="property-location">📍 {property.location}</p>

                {/* Area + Bedroom + Bathroom + Floors + Garage */}
                <div className="property-details" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <span className="property-detail">📐 {property.area.toLocaleString()} m²</span>
                  {property.bedrooms > 0 && (
                    <span className="property-detail">🛏️ {property.bedrooms} PN</span>
                  )}
                  {property.bathrooms > 0 && (
                    <span className="property-detail">🚿 {property.bathrooms} PT</span>
                  )}
                  {property.floors > 0 && (
                    <span className="property-detail">🏢 {property.floors} tầng</span>
                  )}
                  {property.garage > 0 && (
                    <span className="property-detail">🚗 {property.garage} xe</span>
                  )}
                </div>

                {/* Price */}
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