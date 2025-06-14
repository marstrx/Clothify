import { useEffect, useState, useCallback } from "react";

const API_URL = "http://127.0.0.1:8000/api";
const CACHE_DURATION = 5 * 60 * 1000;

const cache = {
    data: new Map(),
    timestamps: new Map(),
    set: function(key, value) {
        this.data.set(key, value);
        this.timestamps.set(key, Date.now());
    },
    get: function(key) {
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

export const useProducts = (category = null, featured = false) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            const cacheKey = featured ? 'featured' : `products_${category || 'all'}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                setProducts(cachedData);
                setLoading(false);
                return;
            }

            let url = `${API_URL}/products`;
            if (featured) {
                url = `${API_URL}/products/featured`;
            } else if (category) {
                url = `${API_URL}/products?category=${category}`;
            }

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Failed to fetch products (Status: ${res.status})`);
            }

            const data = await res.json();
            setProducts(data);
            
            cache.set(cacheKey, data);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching products');
        } finally {
            setLoading(false);
        }
    }, [category, featured]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
};