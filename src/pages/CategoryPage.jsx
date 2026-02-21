import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = ({ user, onAddToCart, onShowAuth }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allProducts = await response.json();
      
      // Filter products by category
      const categoryProducts = allProducts.filter(product => 
        product.category === categoryName
      );
      
      setProducts(categoryProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [categoryName]);

  const handleAddToCart = (product, isEcoAlternative) => {
    if (!user) {
      onShowAuth();
      return;
    }
    onAddToCart(product, isEcoAlternative);
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading">Loading {categoryName} products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-message">
          <h2>Error loading products</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryName}</h1>
        <p>Discover eco-friendly alternatives in {categoryName}</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <h2>No products found in {categoryName}</h2>
          <p>We're working on adding more eco-friendly products to this category.</p>
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div className="product-card" key={product._id}>
              <div className="product-comparison">
                <div className="product-option">
                  <div className="product-image">
                    <img 
                      src={product.bestsellerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'} 
                      alt={product.bestseller}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop';
                      }}
                    />
                  </div>
                  <div className="product-name">{product.bestseller}</div>
                  <div className="product-label">Non Eco-Friendly</div>
                  <div className="price">₹{(product.bestsellerPrice / 100).toFixed(2)}</div>
                </div>
                
                <div className="comparison-arrow">→</div>
                
                <div className="product-option eco-option">
                  <div className="product-image">
                    <img 
                      src={product.ecoImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'} 
                      alt={product.ecoAlternative}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop';
                      }}
                    />
                  </div>
                  <div className="product-name">{product.ecoAlternative}</div>
                  <div className="product-label">Eco-Friendly</div>
                  <div className="price">₹{(product.ecoPrice / 100).toFixed(2)}</div>
                  <div className="ecopoints">+{product.pointValue} EcoPoints</div>
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn regular"
                  onClick={() => handleAddToCart(product, false)}
                >
                  Add Non Eco-Friendly
                </button>
                <button 
                  className="add-to-cart-btn eco"
                  onClick={() => handleAddToCart(product, true)}
                >
                  Add Eco (+{product.pointValue} pts)
                </button>
                <Link 
                  to={`/product/${product._id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 