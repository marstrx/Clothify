import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.1;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = subtotal > 50 ? 0 : 5.99;
    return subtotal + tax + shipping;
  };

  const handleRemoveItem = (item) => {
    const itemKey = item.id + (item.selectedSize ? `-${item.selectedSize}` : '');
    removeFromCart(itemKey);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity, item.selectedSize);
  };

  const handleCheckout = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <i className="bi bi-cart3 display-1 text-muted"></i>
        <h2 className="mt-3">Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="mb-4">Your Shopping Cart</h1>

      <div className="row">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize || 'no-size'}`} className="card mb-3 cart-item">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid cart-item-image"
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{item.name}</h5>
                      <button
                        className="btn btn-sm text-danger"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <p className="card-text text-primary fw-bold">
                      ${(parseFloat(item.price) || 0).toFixed(2)}
                    </p>
                    {item.selectedSize && (
                      <p className="card-text text-muted">Size: {item.selectedSize}</p>
                    )}
                    <div className="d-flex align-items-center mt-2">
                      <div className="input-group" style={{ maxWidth: "120px" }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <p className="ms-auto fw-bold mb-0">
                        ${((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-3">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>
                  {calculateSubtotal() > 50 ? 'Free' : '$5.99'}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleCheckout}
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
