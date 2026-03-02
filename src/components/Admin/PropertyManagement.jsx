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
      alert('Failed to delete property');
    }
  };

  const handleFormClose = () => {
    setShowModal(false);
    setEditingProperty(null);
  };

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

  return (
    <div className="management-page">
      <div className="page-header">
        <h1 className="page-title">Property Management</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          ➕ Add Property
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">🏠</div>
          <h3>No Properties Found</h3>
          <p>Start by adding your first property listing.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Area (sqft)</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id}>
                  <td>{property.id}</td>
                  <td>{property.title}</td>
                  <td>
                    <span className={`property-type-badge badge-${property.type}`}>
                      {property.type}
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
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => setDeleteConfirm(property.id)}
                        title="Delete"
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

      {/* Property Form Modal */}
      {showModal && (
        <PropertyForm 
          property={editingProperty} 
          onClose={handleFormClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;