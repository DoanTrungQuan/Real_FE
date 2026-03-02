import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../../contexts/PropertyContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { getPropertyById, loading } = useProperty();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Không tìm thấy bất động sản');
      }
    };
    fetchProperty();
  }, [id, getPropertyById]);

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

  const handleViewMap = () => {
    if (property?.latitude && property?.longitude) {
      navigate(
        `/map?lat=${property.latitude}&lng=${property.longitude}&id=${property.id}&title=${encodeURIComponent(property.title)}&price=${property.price}&image=${encodeURIComponent(property.image || '')}`
      );
    } else {
      alert('Bất động sản này chưa có tọa độ trên bản đồ.');
    }
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
          <div className="no-data-icon">!</div>
          <h3>{error || 'Không tìm thấy bất động sản'}</h3>
          <Link to="/properties" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Quay Lại Danh Sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <Link to="/properties" className="back-button">
        ← Quay Lại Danh Sách
      </Link>

      <div className="property-detail-container">
        <div className="property-main">
          <div className="property-main-image">
            <img
              src={property.image || property.images?.[0] || '/placeholder.jpg'}
              alt={property.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            />
          </div>
          <div className="property-main-content">
            <div className="property-main-header">
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className={`property-type-badge badge-${property.type}`}>
                    {getTypeLabel(property.type)}
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
                <div className="value">{property.area.toLocaleString()} m²</div>
                <div className="label">Diện Tích</div>
              </div>
              <div className="property-info-item">
                <div className="icon">🏷️</div>
                <div className="value">{getTypeLabel(property.type)}</div>
                <div className="label">Loại</div>
              </div>
              <div className="property-info-item">
                <div className="icon">📊</div>
                <div className="value">{getStatusBadge(property.status)}</div>
                <div className="label">Trạng Thái</div>
              </div>
              <div className="property-info-item">
                <div className="icon">📅</div>
                <div className="value">{property.createdAt}</div>
                <div className="label">Ngày Đăng</div>
              </div>
              {property.bedrooms > 0 && (
                <div className="property-info-item">
                  <div className="icon">🛏️</div>
                  <div className="value">{property.bedrooms}</div>
                  <div className="label">Phòng Ngủ</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="property-info-item">
                  <div className="icon">🚿</div>
                  <div className="value">{property.bathrooms}</div>
                  <div className="label">Phòng Tắm</div>
                </div>
              )}
              {property.floors > 0 && (
                <div className="property-info-item">
                  <div className="icon">🏢</div>
                  <div className="value">{property.floors}</div>
                  <div className="label">Số Tầng</div>
                </div>
              )}
              {property.garage > 0 && (
                <div className="property-info-item">
                  <div className="icon">🚗</div>
                  <div className="value">{property.garage}</div>
                  <div className="label">Garage</div>
                </div>
              )}
            </div>

            <div className="property-description">
              <h3>Mô Tả</h3>
              <p>{property.description}</p>
            </div>
          </div>
        </div>

        <div className="seller-card">
          <h3>Thông Tin Người Bán</h3>
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
                📞 Liên Hệ Người Bán
              </button>
              <button className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                💬 Gửi Tin Nhắn
              </button>
            </>
          ) : (
            <p>Không có thông tin người bán</p>
          )}

          <button
            className="btn btn-outline"
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={handleViewMap}
          >
            🗺️ Xem Trên Bản Đồ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;