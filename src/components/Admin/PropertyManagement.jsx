import React, { useEffect, useState } from 'react';
import { useProperty } from '../../contexts/PropertyContext';
import PropertyForm from './PropertyForm';

const PropertyManagement = () => {
  const { 
    properties, 
    fetchProperties, 
    deleteProperty, 
    loading 
  } = useProperty();
  
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleAdd = () => {
    setEditingProperty(null);
    setShowModal(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      setDeleteConfirm(null);
    } catch (error) {
      alert('Xóa bất động sản thất bại');
    }
  };

  const handleFormClose = () => {
    setShowModal(false);
    setEditingProperty(null);
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
    <div className="management-page">
      <div className="page-header">
        <h1 className="page-title">Quản Lý Bất Động Sản</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          ➕ Thêm Bất Động Sản
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">🏠</div>
          <h3>Không Có Bất Động Sản</h3>
          <p>Bắt đầu bằng cách thêm bất động sản đầu tiên của bạn.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu Đề</th>
                <th>Loại</th>
                <th>Địa Chỉ</th>
                <th>Diện Tích (m²)</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id}>
                  <td>{property.id}</td>
                  <td>{property.title}</td>
                  <td>
                    <span className={`property-type-badge badge-${property.type}`}>
                      {getTypeLabel(property.type)}
                    </span>
                  </td>
                  <td>{property.location}</td>
                  <td>{property.area.toLocaleString()}</td>
                  <td>{formatCurrency(property.price)}</td>
                  <td>{getStatusBadge(property.status)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-icon edit"
                        onClick={() => handleEdit(property)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => setDeleteConfirm(property.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Bất Động Sản */}
      {showModal && (
        <PropertyForm 
          property={editingProperty} 
          onClose={handleFormClose}
        />
      )}

      {/* Modal Xác Nhận Xóa */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Xác Nhận Xóa</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa bất động sản này không? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(deleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;