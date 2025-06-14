import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../Hooks/useProducts';
import womenBanner from '../../assets/images/women-banner.jpg';
import "./Women.css";

const Women = () => {
  const { addToCart } = useCart();
  const { products: womenProducts, loading, error } = useProducts('women');

  return (
    <div className="women-container">
      {/* Collection Header */}
      <div className="collection-header">
        <h1>Women's Collection</h1>
        <p>Discover our latest styles and trends</p>
      </div>

      {/* Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="hero-banner position-relative">
          <div className="banner-grid">
            <div className="banner-main"
              style={{
                backgroundImage: `url(${womenBanner})`
              }}
            >
              <div className="banner-overlay"></div>
            </div>
            <div className="banner-side">
              <div className="banner-side-top"
                style={{
                  backgroundImage: `url(${womenBanner})`
                }}
              ></div>
              <div className="banner-side-bottom"
                style={{
                  backgroundImage: `url(${womenBanner})`
                }}
              ></div>
            </div>
          </div>
          <div className="banner-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <h1 className="display-3 fw-bold text-white mb-4">Women's Collection</h1>
                  <p className="lead text-white mb-4">Discover our latest styles and trends</p>
                  <div className="d-flex gap-3">
                    <button className="btn btn-primary btn-lg px-4">Shop Now</button>
                    <button className="btn btn-outline-light btn-lg px-4">New Arrivals</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-bar bg-light py-4">
        <div className="container">
          <div className="row justify-content-center text-center g-4">
            <div className="col-md-3">
              <i className="bi bi-truck fs-2 text-primary mb-2"></i>
              <h6>Free Shipping</h6>
              <p className="text-muted small mb-0">On orders over $100</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-arrow-repeat fs-2 text-primary mb-2"></i>
              <h6>Easy Returns</h6>
              <p className="text-muted small mb-0">30-day return policy</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-shield-check fs-2 text-primary mb-2"></i>
              <h6>Secure Shopping</h6>
              <p className="text-muted small mb-0">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
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
        ) : womenProducts.length === 0 ? (
          <div className="no-products-container">
            <p>No women's products found. Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="product-grid">
            {womenProducts.map((product) => (
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
                      to={`/product/women/${product.id}`}
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
                  <p className="product-description">{product.description || 'Stylish women\'s fashion item'}</p>
                  <Link
                    to={`/product/women/${product.id}`}
                    className="view-details"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h3 className="mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-muted mb-4">Stay updated with our latest collections and exclusive offers</p>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Enter your email" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Women;