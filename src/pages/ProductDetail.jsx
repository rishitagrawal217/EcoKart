import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ user, onAddToCart, onShowAuth }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allProducts = await response.json();
      
      // Find the specific product
      const foundProduct = allProducts.find(p => p._id === productId);
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }
      
      setProduct(foundProduct);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [productId]);

  const handleAddToCart = (isEcoAlternative) => {
    if (!user) {
      onShowAuth();
      return;
    }
    onAddToCart(product, isEcoAlternative);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-message">
          <h2>Error loading product</h2>
          <p>{error || 'Product not found'}</p>
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to={`/category/${product.category}`}>{product.category}</Link>
          <span> / </span>
          <span>Product Details</span>
        </div>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="image-section">
              <h3>Non Eco-Friendly Product</h3>
              <div className="product-image large">
                <img 
                  src={product.bestsellerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'} 
                  alt={product.bestseller}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                  }}
                />
              </div>
              <h4>{product.bestseller}</h4>
              <p className="product-description">
                This is the non eco-friendly choice that most people buy. While it serves its purpose, 
                it may not be the most environmentally friendly option.
              </p>
              <div className="price">₹{(product.bestsellerPrice / 100).toFixed(2)}</div>
            </div>

            <div className="comparison-arrow-large">→</div>

            <div className="image-section eco">
              <h3>Eco-Friendly Alternative</h3>
              <div className="product-image large eco">
                <img 
                  src={product.ecoImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'} 
                  alt={product.ecoAlternative}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                  }}
                />
              </div>
              <h4>{product.ecoAlternative}</h4>
              <p className="product-description">
                This eco-friendly alternative provides the same functionality while being 
                better for the environment. Made with sustainable materials and processes.
              </p>
              <div className="price">₹{(product.ecoPrice / 100).toFixed(2)}</div>
              <div className="eco-benefits">
                <div className="eco-points-badge">
                  🌱 +{product.pointValue} EcoPoints
                </div>
                <ul className="benefits-list">
                  <li>♻️ Made from recycled materials</li>
                  <li>🌿 Biodegradable packaging</li>
                  <li>⚡ Energy-efficient production</li>
                  <li>💧 Water-saving manufacturing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="product-actions-detail">
            <div className="action-section">
              <h3>Add to Cart</h3>
              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn regular large"
                  onClick={() => handleAddToCart(false)}
                >
                  <span className="btn-icon">🛍️</span>
                  <span className="btn-text">
                    <strong>Add Non Eco-Friendly</strong>
                    <small>₹{(product.bestsellerPrice / 100).toFixed(2)}</small>
                  </span>
                </button>
                
                <button 
                  className="add-to-cart-btn eco large"
                  onClick={() => handleAddToCart(true)}
                >
                  <span className="btn-icon">🌱</span>
                  <span className="btn-text">
                    <strong>Add Eco-Friendly</strong>
                    <small>₹{(product.ecoPrice / 100).toFixed(2)} +{product.pointValue} EcoPoints</small>
                  </span>
                </button>
              </div>
            </div>

            <div className="product-info">
              <h3>Product Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Category:</strong> {product.category}
                </div>
                <div className="info-item">
                  <strong>EcoPoints Value:</strong> {product.pointValue} points
                </div>
              </div>
            </div>

            <div className="eco-impact">
              <h3>Environmental Impact</h3>
              <div className="impact-comparison">
                <div className="impact-item regular">
                  <h4>Non Eco-Friendly Product</h4>
                  <div className="impact-meter high">
                    <div className="meter-fill high"></div>
                  </div>
                  <p>Higher carbon footprint</p>
                </div>
                <div className="impact-item eco">
                  <h4>Eco-Friendly Alternative</h4>
                  <div className="impact-meter low">
                    <div className="meter-fill low"></div>
                  </div>
                  <p>Reduced environmental impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="related-actions">
          <Link to={`/category/${product.category}`} className="back-to-category-btn">
            ← Back to {product.category}
          </Link>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 