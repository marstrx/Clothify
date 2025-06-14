import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css';

const API_URL = 'http://localhost:8000/api';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    old_price: '',
    price: '',
    image: '',
    stock: 0,
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Product created successfully:', result);

      navigate('/admin/panel');
    } catch (err) {
      setError(err.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container">
      <h2>Create New Product</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Old Price:</label>
          <input
            type="number"
            name="old_price"
            value={product.old_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            name="image"
            value={product.image}
            onChange={handleChange}
          />
        </div>
        {product.image && (
          <div className="image-preview">
            <img src={product.image} alt="Preview" />
          </div>
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;