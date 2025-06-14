import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../Hooks/useProducts';
import './Products.css';

const Products = () => {
    const { addToCart } = useCart();
    const { products, loading, error } = useProducts();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('default');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
            setCurrentPage(1);
        }
    }, [searchParams]);

    useEffect(() => {
        let result = [...products];

        if (selectedCategory !== 'all') {
            result = result.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-high':
                result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'rating':
                result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
            default:
                break;
        }

        setCurrentPage(1);
        setFilteredProducts(result);
    }, [products, selectedCategory, sortBy]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="products-container">
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-container">
                <div className="container py-5 text-center">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="container py-5">
                <h1 className="text-center mb-5">All Products</h1>

                {/* Filters and Sort */}
                <div className="filters-container mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="category-filters">
                                <button
                                    className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn ${selectedCategory === 'women' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('women')}
                                >
                                    Women
                                </button>
                                <button
                                    className={`filter-btn ${selectedCategory === 'men' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('men')}
                                >
                                    Men
                                </button>
                                <button
                                    className={`filter-btn ${selectedCategory === 'kids' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('kids')}
                                >
                                    Kids
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="sort-options">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Sort by: Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
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
                                <div className="product-rating">
                                    {'★'.repeat(Math.floor(product.rating))}
                                    {'☆'.repeat(5 - Math.floor(product.rating))}
                                    <span className="rating-value">({product.rating})</span>
                                </div>
                                <Link to={`/product/${product.category}/${product.id}`} className="view-details">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center mt-5">
                        <p>No products found in this category.</p>
                    </div>
                )}

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
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
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

export default Products; 