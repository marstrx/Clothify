import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../Hooks/useProducts';
import { useCart } from '../../context/CartContext';
import './Men.css';

const Men = () => {
    const { products: menProducts, loading, error } = useProducts('men');
    const { addToCart } = useCart();
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const sortedProducts = [...menProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low-high':
                return a.price - b.price;
            case 'price-high-low':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="men-container d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="men-container">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="men-container">
            <div className="container">
                <div className="filters-container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h2 className="mb-0">Men's Collection</h2>
                        </div>
                        <div className="col-md-6">
                            <div className="sort-options">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="default">Sort by</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-grid">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-actions">
                                    <button className="action-btn">
                                        <i className="fas fa-heart"></i>
                                    </button>
                                    <button className="action-btn">
                                        <i className="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                                <div className="add-to-cart">
                                    <button
                                        className="cart-btn"
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <div className="product-info">
                                <span className="product-category">{product.category}</span>
                                <h3 className="product-title">{product.name}</h3>
                                <div className="price-container">
                                    <p className="product-price">${product.price.toFixed(2)}</p>
                                    {product.old_price && (
                                        <p className="old-price">${product.old_price.toFixed(2)}</p>
                                    )}
                                </div>
                                <div className="product-rating">
                                    {'★'.repeat(Math.floor(product.rating))}
                                    {'☆'.repeat(5 - Math.floor(product.rating))}
                                    <span className="rating-value">({product.rating.toFixed(1)})</span>
                                </div>
                                <Link to={`/product/${product.id}`} className="view-details">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container">
                        <nav aria-label="Product pagination">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li
                                        key={index + 1}
                                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Men; 