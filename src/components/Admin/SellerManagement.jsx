import React, { useEffect, useState } from 'react';
import { useProperty } from '../../contexts/PropertyContext';
import SellerForm from './SellerForm';

const SellerManagement = () => {
  const { sellers, fetchSellers, deleteSeller, loading } = useProperty();
  const [showModal, setShowModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleAdd = () => {
    setEditingSeller(null);
    setShowModal(true);
  };

  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSeller(id);
      setDeleteConfirm(null);
    } catch (error) {
      alert('Xóa người bán thất bại');
    }
  };

  const handleFormClose = () => {
    setShowModal(false);
    setEditingSeller(null);
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1 className="page-title">Quản Lý Người Bán</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          ➕ Thêm Người Bán
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : sellers.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">👥</div>
          <h3>Không Tìm Thấy Người Bán</h3>
          <p>Bắt đầu bằng cách thêm người bán đầu tiên.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Số Điện Thoại</th>
                <th>Công Ty</th>
                <th>Địa Chỉ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => (
                <tr key={seller.id}>
                  <td>{seller.id}</td>
                  <td>{seller.name}</td>
                  <td>{seller.email}</td>
                  <td>{seller.phone}</td>
                  <td>{seller.company}</td>
                  <td>{seller.address}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-icon edit"
                        onClick={() => handleEdit(seller)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => setDeleteConfirm(seller.id)}
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

      {/* Modal Thêm/Sửa Người Bán */}
      {showModal && (
        <SellerForm 
          seller={editingSeller} 
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
              <p>Bạn có chắc chắn muốn xóa người bán này không? Hành động này không thể hoàn tác.</p>
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

export default SellerManagement;