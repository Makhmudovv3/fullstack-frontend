import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Checkout.css';
import bk from "../../assets/bk.png";
import { clearCart, createOrder } from '../../redux/shopSlice';

const Checkout = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state) => state.shop.cart || []);
    const user = useSelector((state) => state.shop.user);

    const [firstName, setFirstName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (Number(item.price) * Number(item.quantity || 1));
    }, 0);

    // Buyurtma berish funksiyasi
    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.warning(t('notifications.login_required') || 'Please login first');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (cartItems.length === 0) {
            toast.error(t('notifications.cart_empty') || 'Your cart is empty');
            return;
        }

        try {
            // Send Telegram notification
            const token = '8757971495:AAHNjvDqmje_uidEOoJZpPf_MHsd0N6YO-c';
            const chatId = '6205699347';
            let message = `🛒 <b>Yangi Buyurtma tushdi!</b>\n\n`;
            message += `👤 <b>Mijoz:</b> ${user.name} (${user.email})\n`;
            message += `📞 <b>Telefon:</b> ${phone}\n`;
            message += `🏠 <b>Manzil:</b> ${city}, ${address}\n`;
            message += `💵 <b>Jami summa:</b> $${subtotal}\n\n`;
            message += `📦 <b>Mahsulotlar:</b>\n`;
            cartItems.forEach((item, index) => {
                message += `${index + 1}. ${item.name} — ${item.quantity} ta ($${item.price})\n`;
            });

            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
            });

            // Create order in backend (which clears cart items in database)
            try {
                await dispatch(createOrder()).unwrap();
            } catch (err) {
                console.warn('Backend order creation failed, but proceeding with frontend order', err);
            }

            // Clear cart after successful order
            dispatch(clearCart());
            toast.success(t('notifications.order_success') || '✅ Buyurtmangiz qabul qilindi!');
            navigate('/');
        } catch (error) {
            toast.error('Buyurtma berishda xatolik yuz berdi');
        }
    };

    return (
        <div className="checkout-page-wrapper">
            <ToastContainer />
            <div className="checkout-container">
                <div className="checkout-path">
                    {t('breadcrumbs.account')} / {t('breadcrumbs.my_account')} / {t('breadcrumbs.product')} / {t('breadcrumbs.view_cart')} / <span>{t('breadcrumbs.checkout')}</span>
                </div>

                <h1 className="billing-main-title">{t('checkout.billing_details')}</h1>

                <div className="checkout-main-content">
                    <form className="billing-form-fields" id="checkout-form" onSubmit={handlePlaceOrder}>
                        <div className="checkout-field">
                            <label>{t('checkout.first_name')} <span className="star">*</span></label>
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="checkout-field">
                            <label>{t('checkout.street_address')} <span className="star">*</span></label>
                            <input type="text" required value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                        <div className="checkout-field">
                            <label>{t('checkout.city')} <span className="star">*</span></label>
                            <input type="text" required value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div className="checkout-field">
                            <label>{t('checkout.phone')} <span className="star">*</span></label>
                            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className="checkout-field">
                            <label>{t('checkout.email')} <span className="star">*</span></label>
                            <input type="email" required />
                        </div>
                        <div className="checkout-checkbox">
                            <input type="checkbox" id="saveInfo" />
                            <label htmlFor="saveInfo">{t('checkout.save_info')}</label>
                        </div>
                    </form>

                    <div className="checkout-order-summary">
                        <div className="checkout-items-list">
                            {cartItems.map((item) => (
                                <div className="check-item" key={item.id}>
                                    <div className="check-item-left">
                                        <img src={item.image || item.img} alt={item.name} />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="check-item-price">${(item.price * (item.quantity || 1)).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-total-calc">
                            <div className="calc-item">
                                <span>{t('checkout.subtotal')}:</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <hr />
                            <div className="calc-item">
                                <span>{t('checkout.shipping')}:</span>
                                <span>{t('checkout.free')}</span>
                            </div>
                            <hr />
                            <div className="calc-item bold-total">
                                <span>{t('checkout.total')}:</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="checkout-payment-box">
                            <div className="pay-option">
                                <div className="radio-group">
                                    <input type="radio" name="payment" id="bank" />
                                    <label htmlFor="bank">{t('checkout.bank')}</label>
                                </div>
                                <div className="pay-icons">
                                    <img src={bk} alt="cards" />
                                </div>
                            </div>
                            <div className="pay-option">
                                <div className="radio-group">
                                    <input type="radio" name="payment" id="cash" defaultChecked />
                                    <label htmlFor="cash">{t('checkout.cash')}</label>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-coupon-area">
                            <input type="text" placeholder={t('checkout.coupon_code')} />
                            <button type="button" className="checkout-apply-btn">{t('checkout.apply_coupon')}</button>
                        </div>

                        <button type="submit" form="checkout-form" className="checkout-place-order-btn">
                            {t('checkout.place_order')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;