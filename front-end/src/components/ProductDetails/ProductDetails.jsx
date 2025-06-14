import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductDetails.css';

const API_URL = "http://127.0.0.1:8000/api";
const CACHE_DURATION = 5 * 60 * 1000;

const productCache = {
  data: new Map(),
  timestamps: new Map(),
  set: function (key, value) {
    this.data.set(key, value);
    this.timestamps.set(key, Date.now());
  },
  get: function (key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return null;
    if (Date.now() - timestamp > CACHE_DURATION) {
      this.data.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.data.get(key);
  }
};

const ProductDetails = () => {
  const { category, id } = useParams();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProductDetails = useCallback(async () => {
    try {
      const cacheKey = `product_${id}`;
      const cachedProduct = productCache.get(cacheKey);
      if (cachedProduct) {
        setProduct(cachedProduct);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetch(`${API_URL}/products/${id}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch product (Status: ${res.status})`);
      }

      const data = await res.json();

      if (data.category.toLowerCase() !== category.toLowerCase()) {
        throw new Error('Product category mismatch');
      }

      setProduct(data);
      productCache.set(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, category]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      quantity: 1
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-container">
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/${category}`)}
          >
            Back to {category.charAt(0).toUpperCase() + category.slice(1)} Collection
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="container py-5 text-center">
          <div className="alert alert-warning" role="alert">
            Product not found
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/${category}`)}
          >
            Back to {category.charAt(0).toUpperCase() + category.slice(1)} Collection
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((parseFloat(product.old_price) - parseFloat(product.price)) / parseFloat(product.old_price)) * 100
  );

  return (
    <div className="product-details-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
                loading="lazy"
                width="500"
                height="600"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price-container">
                <span className="product-price">${product.price}</span>
                {product.old_price && (
                  <>
                    <span className="old-price">${product.old_price}</span>
                    <span className="discount-badge">-{discountPercentage}%</span>
                  </>
                )}
              </div>
              <p className="product-description">{product.description}</p>
              <div className="size-selector">
                <label>Select Size:</label>
                <div className="size-options">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;