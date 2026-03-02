import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'navbar-link active' : 'navbar-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏠 RealEstate Management
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/properties" className={isActive('/properties')}>
                Bất Động Sản
              </Link>
              <Link to="/map" className={isActive('/map')}>
                🗺️ Bản Đồ
              </Link>
              
              {isAdmin() && (
                <>
                  <Link to="/admin" className={isActive('/admin')}>
                    Tổng Quan
                  </Link>
                  <Link to="/admin/properties" className={isActive('/admin/properties')}>
                    Quản Lý BĐS
                  </Link>
                  <Link to="/admin/sellers" className={isActive('/admin/sellers')}>
                    Quản Lý Người Bán
                  </Link>
                </>
              )}

              <div className="navbar-user">
                <span>👤 {user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Đăng Xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>
                Đăng Nhập
              </Link>
              <Link to="/register" className={isActive('/register')}>
                Đăng Ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;