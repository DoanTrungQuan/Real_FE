import React, { useState, useEffect } from 'react';
import { useProperty } from '../../contexts/PropertyContext';

const PropertyForm = ({ property, onClose }) => {
  const { createProperty, updateProperty, fetchSellers, sellers } = useProperty();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'land',
    location: '',
    area: '',
    price: '',
    status: 'available',
    description: '',
    sellerId: ''
  });

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        type: property.type || 'land',
        location: property.location || '',
        area: property.area || '',
        price: property.price || '',
        status: property.status || 'available',
        description: property.description || '',
        sellerId: property.sellerId || ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        area: parseInt(formData.area),
        price: parseInt(formData.price),
        sellerId: parseInt(formData.sellerId)
      };

      if (property) {
        await updateProperty(property.id, data);
      } else {
        await createProperty(data);
      }
      onClose();
    } catch (error) {
      alert('Lưu bất động sản thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{property ? 'Chỉnh Sửa Bất Động Sản' : 'Thêm Bất Động Sản Mới'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title">Tiêu Đề</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề bất động sản"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="type">Loại Bất Động Sản</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="land">Đất nền</option>
                  <option value="house">Nhà ở</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="commercial">Thương mại</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng Thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="available">Còn trống</option>
                  <option value="pending">Đang chờ</option>
                  <option value="sold">Đã bán</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Địa Chỉ</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Nhập địa chỉ bất động sản"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="area">Diện Tích (m²)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Nhập diện tích"
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá (VNĐ)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Nhập giá"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sellerId">Người Bán</label>
              <select
                id="sellerId"
                name="sellerId"
                value={formData.sellerId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn người bán</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name} - {seller.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô Tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả bất động sản"
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : (property ? 'Cập Nhật' : 'Tạo Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;