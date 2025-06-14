import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavCollapse = () => {
    setIsNavCollapsed(true);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light sticky-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavCollapse}>
          <span className="brand-text">Clothify</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/women" onClick={handleNavCollapse}>Women</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/men" onClick={handleNavCollapse}>Men</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kids" onClick={handleNavCollapse}>Kids</Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle user-action-link"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-lg-inline ms-2">{user.name}</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={handleNavCollapse}>
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        handleNavCollapse();
                        logout();
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link user-action-link"
                  to="/login"
                  onClick={handleNavCollapse}
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-lg-inline ms-2">Login</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                className="nav-link user-action-link"
                to="/cart"
                onClick={handleNavCollapse}
              >
                <div className="cart-icon-wrapper">
                  <i className="bi bi-cart3"></i>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>
                <span className="d-none d-lg-inline ms-2">Cart</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;