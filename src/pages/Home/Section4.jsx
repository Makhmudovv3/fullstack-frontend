import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addtoWishlist, removeFromWish, addToCart } from '../../redux/shopSlice';
import { toast } from 'react-toastify';
import './Section4.css';

import Coat from "../../assets/Coat.png";
import Bag from "../../assets/Bag.png";
import Cooler from "../../assets/Cooler.png";
import Shelf from "../../assets/Shelf.png";

const Section4 = ({ searchValue = "" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.shop.wishlist || []);
    const allProducts = useSelector(state => state.shop.products || []);
    const bestSellers = useMemo(() => {
        const staticProducts = [
            { id: "static-5", name: t('bestSellers.coat'), price: 260, oldPrice: 360, rating: 65, img: Coat },
            { id: "static-6", name: t('bestSellers.bag'), price: 960, oldPrice: 1160, rating: 65, img: Bag },
            { id: "static-7", name: t('bestSellers.cooler'), price: 160, oldPrice: 170, rating: 65, img: Cooler },
            { id: "static-8", name: t('bestSellers.shelf'), price: 360, oldPrice: null, rating: 65, img: Shelf },
        ];
        const dynamicProducts = [...allProducts].reverse().slice(0, 4).map(p => ({
            ...p,
            oldPrice: Math.round(Number(p.price) * 1.1),
            rating: 65
        }));
        return [...dynamicProducts, ...staticProducts];
    }, [allProducts, t]);

    const handleWishlistToggle = async (product) => {
        const isExist = wishlist.find(item => String(item.id) === String(product.id));
        try {
            if (isExist) {
                await dispatch(removeFromWish(product.id)).unwrap();
                toast.info(t('notifications.removedFromWish'));
            } else {
                await dispatch(addtoWishlist(product)).unwrap();
                toast.success(t('notifications.addedToWish'));
            }
        } catch (err) {
            toast.error(t('notifications.error_msg'));
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await dispatch(addToCart(product)).unwrap();
            toast.success(t('notifications.addedToCart'));
        } catch (err) {
            toast.error(t('notifications.error_msg'));
        }
    };

    const filteredProducts = bestSellers.filter((product) =>
        product.name && product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (searchValue && filteredProducts.length === 0) return null;

    return (
        <section className="section4-container">
            {!searchValue && (
                <div className="section4-header-wrapper">
                    <div className="section4-label-container">
                        <span className="label-rectangle"></span>
                        <span className="section4-label">{t('section4.label')}</span>
                    </div>
                    <div className="section4-header-bottom">
                        <h2 className="section4-title">{t('section4.title')}</h2>
                        <button className="section4-view-all-top" onClick={() => navigate('/shop')}>
                            {t('section4.viewAll')}
                        </button>
                    </div>
                </div>
            )}

            <div className="section4-grid">
                {filteredProducts.map((product) => {
                    const isFavorite = wishlist.some(wish => String(wish.id) === String(product.id));
                    return (
                        <div key={product.id} className="section4-card">
                            <div className="section4-card-top">
                                <div className="section4-icons">
                                    <button className="icon-btn" onClick={() => handleWishlistToggle(product)}>
                                        <Heart size={20} fill={isFavorite ? "#DB4444" : "none"} color={isFavorite ? "#DB4444" : "currentColor"} />
                                    </button>
                                    <button className="icon-btn" onClick={() => navigate(`/product/${product.id}`)}>
                                        <Eye size={20} />
                                    </button>
                                </div>
                                <img src={product.img} alt={product.name} />
                                <button className="desktop-hover-btn" onClick={() => handleAddToCart(product)}>
                                    {t('section4.basket')}
                                </button>
                            </div>

                            <div className="section4-card-info">
                                <h4 className="product-name">{product.name}</h4>
                                <div className="section4-price-row">
                                    <span className="section4-current-price">${product.price}</span>
                                    {product.oldPrice && <span className="section4-old-price">${product.oldPrice}</span>}
                                </div>
                                <div className="section4-rating-row">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < 4 ? "#FFAD33" : "#D1D1D1"} color={i < 4 ? "#FFAD33" : "#D1D1D1"} />
                                    ))}
                                    <span className="rating-count">({product.rating})</span>
                                </div>

                                <button className="mobile-cart-btn" onClick={() => handleAddToCart(product)}>
                                    <ShoppingCart size={18} />
                                    <span>{t('section4.basket')}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Section4;