import React, { useState, useEffect } from 'react';
import ProductForm from '../ProductForm/ProductForm';
import './AdminPanel.css';

const API_URL = 'http://localhost:8000/api';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      const url = selectedProduct
        ? `${API_URL}/products/${selectedProduct.id}`
        : `${API_URL}/products`;

      if (selectedProduct) {
        const data = {};
        formData.forEach((value, key) => {
          if (key === 'price' || key === 'old_price' || key === 'stock') {
            data[key] = parseFloat(value) || 0;
          } else {
            data[key] = value;
          }
        });

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update product');
      } else {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Failed to create product');
      }

      await fetchProducts();
      setShowForm(false);
      setSelectedProduct(null);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await fetchProducts();
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="admin-panel">
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={handleAddProduct}
        >
          Add New Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    {deleteConfirmId === product.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteConfirmId(product.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
