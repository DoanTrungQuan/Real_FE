import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../../contexts/PropertyContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { getPropertyById, loading } = useProperty();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Property not found');
      }
    };
    fetchProperty();
  }, [id, getPropertyById]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const classes = {
      available: 'status-badge status-available',
      sold: 'status-badge status-sold',
      pending: 'status-badge status-pending'
    };
    return <span className={classes[status]}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-page">
        <div className="no-data">
          <div className="no-data-icon">❌</div>
          <h3>{error || 'Property not found'}</h3>
          <Link to="/properties" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <Link to="/properties" className="back-button">
        ← Back to Properties
      </Link>

      <div className="property-detail-container">
        <div className="property-main">
          <div className="property-main-image">
            🏠
          </div>
          <div className="property-main-content">
            <div className="property-main-header">
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className={`property-type-badge badge-${property.type}`}>
                    {property.type}
                  </span>
                  {getStatusBadge(property.status)}
                </div>
                <h1 className="property-main-title">{property.title}</h1>
                <p className="property-location">📍 {property.location}</p>
              </div>
              <div className="property-main-price">
                {formatCurrency(property.price)}
              </div>
            </div>

            <div className="property-info-grid">
              <div className="property-info-item">
                <div className="icon">📐</div>
                <div className="value">{property.area.toLocaleString()} sqft</div>
                <div className="label">Area</div>
              </div>
              <div className="property-info-item">
                <div className="icon">🏷️</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{property.type}</div>
                <div className="label">Type</div>
              </div>
              <div className="property-info-item">
                <div className="icon">📊</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{property.status}</div>
                <div className="label">Status</div>
              </div>
              <div className="property-info-item">
                <div className="icon">📅</div>
                <div className="value">{property.createdAt}</div>
                <div className="label">Listed Date</div>
              </div>
            </div>

            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
          </div>
        </div>

        <div className="seller-card">
          <h3>Seller Information</h3>
          {property.seller ? (
            <>
              <div className="seller-info">
                <div className="seller-avatar">
                  {property.seller.name.charAt(0)}
                </div>
                <div className="seller-details">
                  <h4>{property.seller.name}</h4>
                  <p>{property.seller.company}</p>
                </div>
              </div>

              <div className="seller-contact">
                <div className="contact-item">
                  <span className="icon">📧</span>
                  <span>{property.seller.email}</span>
                </div>
                <div className="contact-item">
                  <span className="icon">📱</span>
                  <span>{property.seller.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <span>{property.seller.address}</span>
                </div>
              </div>

              <button className="btn btn-primary">
                📞 Contact Seller
              </button>
              <button className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                💬 Send Message
              </button>
            </>
          ) : (
            <p>Seller information not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;