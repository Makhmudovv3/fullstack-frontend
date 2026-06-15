import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './Account.css';

const Account = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.shop.user);
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile'); // 'profile', 'orders', 'cancellations', 'reviews'

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data);
        } catch (err) {
            toast.error("Buyurtmalarni yuklashda xato");
        }
    };

    const cancelOrder = async (id) => {
        if (!window.confirm("Rostdan ham bekor qilmoqchimisiz?")) return;
        try {
            await api.put(`/orders/${id}/cancel`);
            toast.success("Buyurtma bekor qilindi");
            fetchOrders();
        } catch (err) {
            toast.error("Bekor qilishda xato");
        }
    };

    const filteredOrders = activeTab === 'orders' 
        ? orders.filter(o => o.status !== 'cancelled')
        : orders.filter(o => o.status === 'cancelled');

    return (
        <div className="account-container">
            <div className="account-content">
                <aside className="account-sidebar">
                    <div className="sidebar-section">
                        <h4>{t('account.sidebar.myOrders', 'Mening hisobim')}</h4>
                        <ul>
                            <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                                {t('account.sidebar.profile', 'Profilni boshqarish')}
                            </li>
                            <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                                {t('account.sidebar.myOrders')}
                            </li>
                            <li className={activeTab === 'cancellations' ? 'active' : ''} onClick={() => setActiveTab('cancellations')}>
                                {t('account.sidebar.cancellations')}
                            </li>
                            <li className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
                                {t('account.sidebar.reviews', 'Mening sharhlarim')}
                            </li>
                        </ul>
                    </div>
                </aside>

                <main className="account-main-card">
                    <h3>
                        {activeTab === 'profile' ? 'Profilni boshqarish' : 
                         activeTab === 'orders' ? 'Mening buyurtmalarim' : 
                         activeTab === 'reviews' ? 'Mening sharhlarim' : 'Bekor qilinganlar'}
                    </h3>
                    
                    {activeTab === 'profile' ? (
                        <div className="profile-section" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Ism:</strong> <span style={{ marginLeft: '10px' }}>{user?.name || 'Kiritilmagan'}</span>
                            </div>
                            <div>
                                <strong>Email:</strong> <span style={{ marginLeft: '10px' }}>{user?.email || 'Kiritilmagan'}</span>
                            </div>
                        </div>
                    ) : activeTab === 'reviews' ? (
                        <div className="reviews-section">
                            <p>Hali sharhlar qoldirilmagan.</p>
                        </div>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mahsulotlar</th>
                                    <th>Summa</th>
                                    <th>Status</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? filteredOrders.map(o => (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {o.OrderItems && o.OrderItems.map(item => (
                                                    <li key={item.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
                                                        {item.Product ? item.Product.name : 'Noma\'lum'} (x{item.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>${o.totalAmount}</td>
                                        <td>{o.status}</td>
                                        <td>
                                            {o.status === 'pending' && (
                                                <button className="cancel-btn" onClick={() => cancelOrder(o.id)}>Bekor qilish</button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Ma'lumot topilmadi</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Account;