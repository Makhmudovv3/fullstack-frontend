import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Star, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addtoWishlist, removeFromWish, addToCart } from '../../redux/shopSlice';
import { toast } from 'react-toastify';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import "./Section2.css";

import Gamepad from "../../assets/Gamepad.png";
import Keyboard from "../../assets/Keyboard.png";
import Monitor from "../../assets/Monitor.png";
import Chair from "../../assets/Chair.png";

const Section2 = ({ searchValue = "" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.shop.wishlist || []);
    const allProducts = useSelector(state => state.shop.products || []);
    const swiperRef = useRef(null);

    const [targetDate] = useState(new Date().getTime() + 343196000);
    const [timeLeft, setTimeLeft] = useState({ Days: 0, Hours: 0, Minutes: 0, Seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = targetDate - new Date().getTime();
            if (diff > 0) {
                setTimeLeft({
                    Days: Math.floor(diff / 86400000),
                    Hours: Math.floor((diff / 3600000) % 24),
                    Minutes: Math.floor((diff / 60000) % 60),
                    Seconds: Math.floor((diff / 1000) % 60),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const products = useMemo(() => {
        const staticProducts = [
            { id: "static-1", name: t('products.gamepad'), price: 120, oldPrice: 160, discount: "-40%", rating: 88, img: Gamepad },
            { id: "static-2", name: t('products.keyboard'), price: 960, oldPrice: 1160, discount: "-35%", rating: 75, img: Keyboard },
            { id: "static-3", name: t('products.monitor'), price: 370, oldPrice: 400, discount: "-30%", rating: 99, img: Monitor },
            { id: "static-4", name: t('products.chair'), price: 375, oldPrice: 400, discount: "-25%", rating: 99, img: Chair },
            { id: "static-5", name: t('products.gamepad'), price: 120, oldPrice: 160, discount: "-40%", rating: 88, img: Gamepad },
            { id: "static-6", name: t('products.keyboard'), price: 960, oldPrice: 1160, discount: "-35%", rating: 75, img: Keyboard },
            { id: "static-7", name: t('products.monitor'), price: 370, oldPrice: 400, discount: "-30%", rating: 99, img: Monitor },
            { id: "static-8", name: t('products.chair'), price: 375, oldPrice: 400, discount: "-25%", rating: 99, img: Chair },
        ];
        
        const dynamicProducts = allProducts.map(p => ({
            ...p,
            discount: "-30%",
            oldPrice: Math.round(Number(p.price) * 1.3),
            rating: 88,
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

    const filteredProducts = products.filter(p =>
        p.name && p.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <section className="section2-container">
            <div className="section2-header">
                <div className="section2-label-container">
                    <span className="label-rectangle"></span>
                    <span className="section2-label">{t('section2.label')}</span>
                </div>
                <div className="section2-header-bottom">
                    <div className="title-timer-wrapper">
                        <h2 className="section2-title">{t('section2.title')}</h2>
                        <div className="section2-timer">
                            {Object.entries(timeLeft).map(([unit, val], i) => (
                                <React.Fragment key={unit}>
                                    <div className="section2-timer-unit">
                                        <span className="unit-label">{t(`section2.timer.${unit}`)}</span>
                                        <h3 className="unit-value">{String(val).padStart(2, '0')}</h3>
                                    </div>
                                    {i < 3 && <span className="section2-separator">:</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="swiper-navigation">
                        <button className="nav-arrow" onClick={() => swiperRef.current?.slidePrev()}>
                            <ArrowLeft size={20} />
                        </button>
                        <button className="nav-arrow" onClick={() => swiperRef.current?.slideNext()}>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
                spaceBetween={30}
                slidesPerView={4}
                enabled={true}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 15, enabled: false }, // 768 gacha swiper o'chik
                    768: { slidesPerView: 2.5, spaceBetween: 20, enabled: true },
                    1024: { slidesPerView: 4, spaceBetween: 30, enabled: true }
                }}
                className="section2-swiper"
            >
                {filteredProducts.map((item) => {
                    const isFavorite = wishlist.some(wish => String(wish.id) === String(item.id));
                    return (
                        <SwiperSlide key={item.id}>
                            <div className="section2-card">
                                <div className="section2-card-top">
                                    <span className="section2-discount">{item.discount}</span>
                                    <div className="section2-icons">
                                        <button className="icon-btn" onClick={() => handleWishlistToggle(item)}>
                                            <Heart size={20} fill={isFavorite ? "#DB4444" : "none"} color={isFavorite ? "#DB4444" : "currentColor"} />
                                        </button>
                                        <button className="icon-btn" onClick={() => navigate(`/product/${item.id}`)}>
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                    <img src={item.img} alt={item.name} />
                                    <button className="desktop-hover-btn" onClick={() => handleAddToCart(item)}>
                                        {t('section2.basket')}
                                    </button>
                                </div>
                                <div className="section2-card-info">
                                    <h4 className="product-name">{item.name}</h4>
                                    <div className="section2-price-row">
                                        <span className="section2-current-price">${item.price}</span>
                                        <span className="section2-old-price">${item.oldPrice}</span>
                                    </div>
                                    <div className="section2-rating-row">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < 4 ? "#FFAD33" : "#D1D1D1"} color={i < 4 ? "#FFAD33" : "#D1D1D1"} />
                                        ))}
                                        <span className="rating-count">({item.rating})</span>
                                    </div>
                                    <button className="mobile-cart-btn" onClick={() => handleAddToCart(item)}>
                                        <ShoppingCart size={18} />
                                        <span>{t('section2.basket')}</span>
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className="section2-footer">
                <button className="section2-view-all">{t('section2.viewAll')}</button>
            </div>
        </section>
    );
};

export default Section2;