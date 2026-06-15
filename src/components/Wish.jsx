import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeFromWish, addToCart } from '../redux/shopSlice';
import { Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Wish.css';

const Wish = () => {
    const { t } = useTranslation();
    const wishlist = useSelector((state) => state.shop.wishlist);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success(t('notifications.addedToCart'));
    };

    const handleMoveAllToBag = () => {
        if (wishlist.length > 0) {
            wishlist.forEach((item) => {
                dispatch(addToCart(item));
            });
            toast.success(t('notifications.addedToCart'));
        }
    };

    const renderCard = (item) => (
        <div className="wish-card">
            <div className="wish-card-img-container">
                <button
                    className="del-icon"
                    onClick={() => {
                        dispatch(removeFromWish(item.id));
                        toast.info(t('notifications.removedFromWish'));
                    }}
                >
                    <Trash2 size={20} />
                </button>
                <img src={item.img} alt={item.name} />
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart size={18} /> {t('section2.basket')}
                </button>
            </div>
            <div className="wish-card-info">
                <h3>{item.name}</h3>
                <div className="wish-price-row">
                    <span className="current-price">${item.price}</span>
                    {item.oldPrice && <span className="old-price">${item.oldPrice}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h2>{t('account.sidebar.wishlist')} ({wishlist.length})</h2>
                <button className="move-all-btn" onClick={handleMoveAllToBag}>
                    {t('cart.btns.update')}
                </button>
            </div>

            {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map((item) => (
                        <div key={item.id}>{renderCard(item)}</div>
                    ))}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <p>{t('not_found.text')}</p>
                </div>
            )}
        </div>
    );
};

export default Wish;