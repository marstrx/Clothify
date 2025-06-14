import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../Hooks/useProducts';
import kidsBanner from '../../assets/images/kids-banner.png';
import './Kids.css';

const Kids = () => {
  const { addToCart } = useCart();
  const { products: kidsProducts, loading, error } = useProducts('kids');

  return (
    <div className="kids-container">
      <div className="collection-header">
        <h1>Kids' Collection</h1>
        <p>Fun, comfortable, and perfect for growing adventures</p>
      </div>

      <section className="hero-banner-section">
        <div className="hero-banner">
          <div className="banner-grid">
            <div className="banner-main"
              style={{
                backgroundImage: `url(${kidsBanner})`
              }}
            >
              <div className="banner-overlay"></div>
            </div>
            <div className="banner-side">
              <div className="banner-side-top"
                style={{
                  backgroundImage: `url(${kidsBanner})`
                }}
              ></div>
              <div className="banner-side-bottom"
                style={{
                  backgroundImage: `url(${kidsBanner})`
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-bar bg-light py-4">
        <div className="container">
          <div className="row justify-content-center text-center g-4">
            <div className="col-md-3">
              <i className="bi bi-truck fs-2 text-primary mb-2"></i>
              <h6>Free Shipping</h6>
              <p className="text-muted small mb-0">On orders over $50</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-arrow-repeat fs-2 text-primary mb-2"></i>
              <h6>Easy Returns</h6>
              <p className="text-muted small mb-0">30-day return policy</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-shield-check fs-2 text-primary mb-2"></i>
              <h6>Safe & Secure</h6>
              <p className="text-muted small mb-0">Kid-friendly materials</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all">View All</Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error loading products: {error}</p>
          </div>
        ) : (
          <div className="product-grid">
            {kidsProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image === 'default.jpg'
                      ? 'https://via.placeholder.com/300x400'
                      : product.image}
                    className="product-image"
                    alt={product.name}
                    loading="lazy"
                  />
                  <div className="product-actions">
                    <button className="action-btn" title="Add to wishlist">♥</button>
                    <Link
                      to={`/product/kids/${product.id}`}
                      className="action-btn"
                      title="Quick view"
                    >
                      👁️
                    </Link>
                  </div>
                  <div className="add-to-cart">
                    <button
                      className="cart-btn"
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        image: product.image === 'default.jpg' ? 'https://via.placeholder.com/300x400' : product.image,
                        quantity: 1,
                        selectedSize: null
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h5 className="product-title">{product.name}</h5>
                  <div className="price-container">
                    <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="old-price">${parseFloat(product.old_price).toFixed(2)}</p>
                  </div>
                  <p className="product-description">{product.description || 'Stylish kids fashion item'}</p>
                  <Link to={`/product/kids/${product.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="newsletter-section bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h3 className="mb-3">Join Our Kids Club!</h3>
              <p className="text-muted mb-4">Get special offers and updates on new arrivals</p>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Parent's email" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kids;