import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        old_price: '',
        category: '',
        stock: '',
        status: 'active',
        image: null,
        imagePreview: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                old_price: product.old_price || '',
                category: product.category || '',
                stock: product.stock || '',
                status: product.status || 'active',
                image: null,
                imagePreview: product.image || null
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files[0]) {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && key !== 'imagePreview') {
                    if (key === 'image' && formData[key]) {
                        formDataToSend.append('image', formData[key]);
                    } else if (key !== 'image') {
                        if (key === 'price' || key === 'old_price' || key === 'stock') {
                            formDataToSend.append(key, parseFloat(formData[key]) || 0);
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }
                }
            });

            await onSubmit(formDataToSend);
        } catch (err) {
            setError('Failed to save product');
            console.error('Error saving product:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="old_price">Old Price</label>
                        <input
                            type="number"
                            id="old_price"
                            name="old_price"
                            value={formData.old_price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Product Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                    />
                </div>

                {formData.imagePreview && (
                    <div className="image-preview">
                        <img src={formData.imagePreview} alt="Preview" />
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="cancel-btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 