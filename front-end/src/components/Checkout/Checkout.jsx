import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: '',
        address: '',
        city: '',
        zipCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + (calculateSubtotal() > 50 ? 0 : 5.99);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // hna payment api
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            clearCart();

            alert('Payment successful! Thank you for your purchase.');
            navigate('/');
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; 
    }

    return (
        <div className="checkout-container">
            <h1 className="mb-4">Checkout</h1>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Payment Information</h5>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cardNumber"
                                            name="cardNumber"
                                            value={paymentInfo.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="expiryDate"
                                            name="expiryDate"
                                            value={paymentInfo.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cvv"
                                            name="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name on Card</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={paymentInfo.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Billing Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={paymentInfo.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={paymentInfo.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="zipCode"
                                            name="zipCode"
                                            value={paymentInfo.zipCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        `Pay $${calculateTotal().toFixed(2)}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Order Summary</h5>

                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize || 'no-size'}`} className="d-flex justify-content-between mb-2">
                                    <span>
                                        {item.name} x {item.quantity}
                                        {item.selectedSize && ` (${item.selectedSize})`}
                                    </span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <hr />

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 