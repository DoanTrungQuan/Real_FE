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
          🏠 RealEstate Pro
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/properties" className={isActive('/properties')}>
                Properties
              </Link>
              
              {isAdmin() && (
                <>
                  <Link to="/admin" className={isActive('/admin')}>
                    Dashboard
                  </Link>
                  <Link to="/admin/properties" className={isActive('/admin/properties')}>
                    Manage Properties
                  </Link>
                  <Link to="/admin/sellers" className={isActive('/admin/sellers')}>
                    Manage Sellers
                  </Link>
                </>
              )}

              <div className="navbar-user">
                <span>👤 {user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>
                Login
              </Link>
              <Link to="/register" className={isActive('/register')}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;