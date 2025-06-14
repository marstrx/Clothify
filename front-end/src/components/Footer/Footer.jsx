import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Clothify</h3>
          <p>Discover the latest fashion trends at Clothify. We provide high-quality clothing for men, women, and kids with a focus on style, comfort, and sustainability.</p>
          <div className="social-links">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-pinterest"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Help & Info</h3>
          <ul className="footer-links">
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns Policy</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="bi bi-geo-alt"></i>
              <span>13 Fashion Street, El Jadida, Morocco</span>
            </div>
            <div className="contact-item">
              <i className="bi bi-telephone"></i>
              <span>+1 111 111 111</span>
            </div>
            <div className="contact-item">
              <i className="bi bi-envelope"></i>
              <span>info@clothify.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Clothify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;