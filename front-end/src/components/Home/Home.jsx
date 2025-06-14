import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../Hooks/useProducts';
import womenBanner from '../../assets/images/women-banner.jpg';
import menBanner from '../../assets/images/men-banner.jpg';
import kidsBanner from '../../assets/images/kids-banner.png';
import './Home.css';

// Banner images
const bannerImages = {
  women: womenBanner,
  men: menBanner,
  kids: kidsBanner
};

const Home = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState([
    {
      title: "Women",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "/women"
    },
    {
      title: "Men",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "/men"
    },
    {
      title: "Kids",
      image: "https://images.unsplash.com/photo-1541580620-33f936718e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "/kids"
    }
  ]);
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts(); // Get all products instead of just featured

  // Shuffle products for display
  const shuffledProducts = useMemo(() => {
    if (!products) return [];
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8); // Show only 8 products
  }, [products]);

  const banners = useMemo(() => [
    {
      title: "Women's Collection 2025",
      subtitle: "Discover our latest styles for women",
      image: bannerImages.women,
      buttonText: "Shop Women",
      buttonLink: "/women",
      alignment: "left"
    },
    {
      title: "Men's Fashion",
      subtitle: "Explore our premium men's collection",
      image: bannerImages.men,
      buttonText: "Shop Men",
      buttonLink: "/men",
      alignment: "center"
    },
    {
      title: "Kids Collection",
      subtitle: "Colorful and comfortable styles for kids",
      image: bannerImages.kids,
      buttonText: "Shop Kids",
      buttonLink: "/kids",
      alignment: "right"
    }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  const handleIndicatorClick = (index) => {
    setCurrentBannerIndex(index);
  };

  const shuffleCategories = () => {
    setCategories(prevCategories => {
      const shuffled = [...prevCategories];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="hero-banner">
          <div
            className="banner-content-wrapper"
            style={{
              backgroundImage: `url(${currentBanner.image})`,
              justifyContent: currentBanner.alignment === 'left' ? 'flex-start' :
                currentBanner.alignment === 'right' ? 'flex-end' : 'center'
            }}
          >
            <div className="banner-content">
              <h1>{currentBanner.title}</h1>
              <p>{currentBanner.subtitle}</p>
              <Link to={currentBanner.buttonLink} className="btn-primary">
                {currentBanner.buttonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Banner Indicators */}
        <div className="banner-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentBannerIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Banner Navigation Arrows */}
        <button
          className="carousel-control prev"
          type="button"
          onClick={() => setCurrentBannerIndex(prev => prev === 0 ? banners.length - 1 : prev - 1)}
        >
          <span aria-hidden="true">❮</span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control next"
          type="button"
          onClick={() => setCurrentBannerIndex(prev => prev === banners.length - 1 ? 0 : prev + 1)}
        >
          <span aria-hidden="true">❯</span>
          <span className="visually-hidden">Next</span>
        </button>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">↩️</span>
              <span>30 Days Return</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure Payment</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎧</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="product-section container">
        <div className="section-header">
          <h2>Latest Products</h2>
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
        ) : shuffledProducts.length === 0 ? (
          <div className="no-products-container">
            <p>No products found. Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="product-grid">
            {shuffledProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    className="product-image"
                    alt={product.name}
                    loading="lazy"
                    width="300"
                    height="400"
                  />
                  <div className="product-actions">
                    <button className="action-btn" title="Add to wishlist">♥</button>
                    <Link
                      to={`/product/${product.category}/${product.id}`}
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
                        image: product.image,
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
                  <p className="product-description">{product.description}</p>
                  <Link to={`/product/${product.category}/${product.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <div className="categories-header">
          <h2>Shop by Category</h2>
          <button
            onClick={shuffleCategories}
            className="shuffle-btn"
            aria-label="Shuffle categories"
          >
            <i className="bi bi-shuffle"></i> Shuffle
          </button>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={category.title}>
              <img
                src={category.image}
                className="category-image"
                alt={`${category.title}'s Fashion`}
              />
              <div className="category-overlay">
                <h3>{category.title}</h3>
                <Link to={category.link} className="shop-now-btn">Shop Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Stay updated with our latest collections and exclusive offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
