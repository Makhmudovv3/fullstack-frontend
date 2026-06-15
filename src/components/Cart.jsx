import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/shopSlice';
import { XCircle, ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.shop.cart || []);
    const dispatch = useDispatch();

    // Umumiy summani hisoblash
    const subtotal = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (Number(item.price) * (Number(item.quantity) || 1)), 0) : 0;

    // Mahsulot sonini o'zgartirish
    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            dispatch(updateQuantity({ id, quantity: newQty }));
        }
    };

    // Savatdan o'chirish
    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
        toast.info(t('notifications.removedFromCart') || 'Removed from cart');
    };

    // Agar savat bo'sh bo'lsa
    if (cart.length === 0) {
        return (
            <div className="cart-empty-wrapper">
                <div className="empty-cart-content">
                    <ShoppingBag size={80} color="#DB4444" />
                    <h2>Savat bo'sh</h2>
                    <button className="btn-red" onClick={() => navigate('/')}>
                        Xarid qilishga qaytish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Mahsulot</th>
                        <th>Narxi</th>
                        <th>Soni</th>
                        <th>Jami</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id} className="cart-row">
                            <td className="cart-product">
                                <div className="cart-img-wrapper">
                                    <XCircle className="remove-icon" size={18} onClick={() => handleRemove(item.id)} />
                                    <img src={item.img} alt={item.name} />
                                </div>
                                <span>{item.name}</span>
                            </td>
                            <td>${item.price}</td>
                            <td>
                                <div className="quantity-control">
                                    <span>{item.quantity}</span>
                                    <div className="quantity-arrows">
                                        <ChevronUp size={14} onClick={() => handleQuantityChange(item.id, item.quantity, 1)} />
                                        <ChevronDown size={14} onClick={() => handleQuantityChange(item.id, item.quantity, -1)} />
                                    </div>
                                </div>
                            </td>
                            <td>${item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-bottom">
                <div className="cart-total-card">
                    <h3>Savat hisobi</h3>
                    <div className="total-row"><span>Jami:</span> <span>${subtotal}</span></div>
                    <button className="btn-red checkout-btn" onClick={() => navigate('/checkout')}>
                        To'lovga o'tish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;