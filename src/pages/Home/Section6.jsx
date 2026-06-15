import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addtoWishlist, removeFromWish, addToCart } from '../../redux/shopSlice';
import { toast } from 'react-toastify';
import './Section6.css';

const Section6 = ({ searchValue = "", category = "" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Backenddan kelgan barcha mahsulotlarni olamiz
    const allProducts = useSelector(state => state.shop.products || []);
    const wishlist = useSelector(state => state.shop.wishlist || []);

    const handleWishlistToggle = async (item) => {
        const isExist = wishlist.find(product => Number(product.id) === Number(item.id));
        try {
            if (isExist) {
                await dispatch(removeFromWish(item.id)).unwrap();
                toast.info(t('notifications.removedFromWish'));
            } else {
                await dispatch(addtoWishlist(item)).unwrap();
                toast.success(t('notifications.addedToWish'));
            }
        } catch (err) {
            toast.error(t('notifications.error_msg'));
        }
    };

    const handleAddToCart = async (item) => {
        try {
            await dispatch(addToCart(item)).unwrap();
            toast.success(t('notifications.addedToCart'));
        } catch (err) {
            toast.error(t('notifications.error_msg'));
        }
    };

    // Filterlash: Search va Kategoriya bo'yicha
    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = searchValue ? p.name.toLowerCase().includes(searchValue.toLowerCase()) : true;
        
        // Backendda Category obyekti bor bo'lsa p.Category.name bo'ladi
        const productCategory = p.Category?.name || "";
        const matchesCategory = category ? productCategory === category : true;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="section6-container">
            <div className="section6-header-wrapper">
                <div className="section6-label-container">
                    <span className="label-rectangle"></span>
                    <span className="section6-label">{t('section6.label')}</span>
                </div>
                <div className="section6-header-bottom">
                    <h2 className="section6-title">{t('section6.title')}</h2>
                </div>
            </div>

            <div className="section6-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(item => {
                        const isFavorite = wishlist.some(wish => Number(wish.id) === Number(item.id));
                        return (
                            <ProductCard
                                key={item.id}
                                item={item}
                                navigate={navigate}
                                t={t}
                                isFavorite={isFavorite}
                                onWishlist={handleWishlistToggle}
                                onAddToCart={handleAddToCart}
                            />
                        );
                    })
                ) : (
                    <p className="no-products">{t('not_found.text')}</p>
                )}
            </div>

            <div className="section6-bottom-action">
                <button className="section6-view-all-btn" onClick={() => navigate('/products')}>
                    {t('section6.viewAll')}
                </button>
            </div>
        </section>
    );
};

const ProductCard = ({ item, navigate, t, isFavorite, onWishlist, onAddToCart }) => {
    return (
        <div className="section6-card">
            <div className="section6-card-top">
                {item.isNew && <span className="section6-badge">{t('section6.new')}</span>}
                <div className="section6-icons">
                    <button className="icon-btn" onClick={() => onWishlist(item)}>
                        <Heart
                            size={20}
                            fill={isFavorite ? "#DB4444" : "none"}
                            color={isFavorite ? "#DB4444" : "currentColor"}
                        />
                    </button>
                    <button className="icon-btn" onClick={() => navigate(`/product/${item.id}`)}>
                        <Eye size={20} />
                    </button>
                </div>
                <div className="section6-img-holder">
                    <img src={item.img} alt={item.name} />
                </div>
                <button className="desktop-hover-btn" onClick={() => onAddToCart(item)}>
                    {t('section6.addToCart')}
                </button>
            </div>

            <div className="section6-card-info">
                <h4 className="product-name">{item.name}</h4>
                <div className="section6-meta-row">
                    <span className="section6-price">${item.price}</span>
                    <div className="section6-rating-group">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < 4 ? "#FFAD33" : "#D1D1D1"}
                                color={i < 4 ? "#FFAD33" : "#D1D1D1"}
                            />
                        ))}
                    </div>
                </div>

                <button className="mobile-cart-btn" onClick={() => onAddToCart(item)}>
                    <ShoppingCart size={18} />
                    <span>{t('section6.basket')}</span>
                </button>
            </div>
        </div>
    );
};

export default Section6;