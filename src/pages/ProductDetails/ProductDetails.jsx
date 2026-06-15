import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Truck, RefreshCw, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addtoWishlist, removeFromWish, addToCart } from '../../redux/shopSlice';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './ProductDetails.css';

import GamepadImg from "../../assets/Gamepad.png";
import Keyboard from "../../assets/Keyboard.png";
import Monitor from "../../assets/Monitor.png";
import Chair from "../../assets/Chair.png";
import Coat from "../../assets/Coat.png";
import Bag from "../../assets/Bag.png";
import Cooler from "../../assets/Cooler.png";
import Shelf from "../../assets/Shelf.png";
import DogFood from "../../assets/img1.png";
import Camera from "../../assets/img2.png";
import Laptop from "../../assets/img3.png";
import Curology from "../../assets/img4.png";
import Car from "../../assets/img5.png";
import Shoes from "../../assets/img6.png";
import ShooterGamepad from "../../assets/img7.png";
import Jacket from "../../assets/img8.png";

const ProductDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.shop.wishlist);
    const reduxProducts = useSelector(state => state.shop.products);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(1);

    const staticProducts = [
        { id: 1, name: t('products.gamepad'), img: GamepadImg, price: 120, description: t('products_desc.gamepad') },
        { id: 2, name: t('products.keyboard'), img: Keyboard, price: 960, description: t('products_desc.keyboard') },
        { id: 3, name: t('products.monitor'), img: Monitor, price: 370, description: t('products_desc.monitor') },
        { id: 4, name: t('products.chair'), img: Chair, price: 375, description: t('products_desc.chair') },
        { id: 5, name: t('bestSellers.coat'), img: Coat, price: 260, description: t('products_desc.coat') },
        { id: 6, name: t('bestSellers.bag'), img: Bag, price: 960, description: t('products_desc.bag') },
        { id: 7, name: t('bestSellers.cooler'), img: Cooler, price: 160, description: t('products_desc.cooler') },
        { id: 8, name: t('bestSellers.shelf'), img: Shelf, price: 360, description: t('products_desc.shelf') },
        { id: 9, name: t('products_list.dogFood'), img: DogFood, price: 100, description: t('products_desc.dogFood') },
        { id: 10, name: t('products_list.camera'), img: Camera, price: 360, description: t('products_desc.camera') },
        { id: 11, name: t('products_list.laptop'), img: Laptop, price: 700, description: t('products_desc.laptop') },
        { id: 12, name: t('products_list.curology'), img: Curology, price: 500, description: t('products_desc.curology') },
        { id: 13, name: t('products_list.car'), img: Car, price: 960, description: t('products_desc.car') },
        { id: 14, name: t('products_list.shoes'), img: Shoes, price: 1160, description: t('products_desc.shoes') },
        { id: 15, name: t('products_list.gamepad'), img: ShooterGamepad, price: 660, description: t('products_desc.shooterGamepad') },
        { id: 16, name: t('products_list.jacket'), img: Jacket, price: 660, description: t('products_desc.jacket') },
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            
            // Check static products first
            const numericId = String(id).replace('static-', '');
            const staticMatch = staticProducts.find(p => String(p.id) === numericId);
            if (staticMatch) {
                setProduct(staticMatch);
                setLoading(false);
                return;
            }

            // Check redux state
            const reduxMatch = reduxProducts.find(p => String(p.id) === String(id));
            if (reduxMatch) {
                setProduct(reduxMatch);
                setLoading(false);
                return;
            }

            // Fetch from backend
            try {
                const res = await api.get(`/products/${id}`);
                const data = res.data;
                const image = data.image || '';
                const imgPath = (image.startsWith('http') || image.startsWith('data:')) 
                    ? image 
                    : `/assets/${image}`;

                setProduct({
                    ...data,
                    img: imgPath
                });
            } catch (err) {
                console.error('Fetch product error:', err);
                toast.error('Mahsulot topilmadi');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, reduxProducts, t]);

    const isFavorite = wishlist.some(item => String(item.id) === String(product?.id));

    const handleWishlistToggle = async () => {
        if (!product) return;
        try {
            if (isFavorite) {
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

    if (loading) return <div className="product-loader">{t('product_details.loading')}</div>;
    if (!product) return <div className="product-loader">{t('not_found.title')}</div>;

    return (
        <div className="product-details-container">
            <p className="product-breadcrumb">{t('header.profile.manage')} / {product.Category?.name || 'Category'} / <span>{product.name}</span></p>

            <div className="product-details-main">
                <div className="product-side-gallery">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="product-small-img-wrapper"><img src={product.img} alt="" /></div>
                    ))}
                </div>

                <div className="product-main-img-wrapper">
                    <img src={product.img} alt={product.name} />
                </div>

                <div className="product-info-content">
                    <h2 className="product-info-title">{product.name}</h2>

                    <div className="product-info-rating-row">
                        <div className="product-info-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < 4 ? "#FFAD33" : "#ccc"} stroke="none" />
                            ))}
                        </div>
                        <span className="product-info-reviews">
                            (150 {t('product_details.reviews')}) | <span className="product-info-stock">{t('product_details.inStock')}</span>
                        </span>
                    </div>

                    <div className="product-info-price">${product.price}.00</div>
                    <p className="product-info-description">{product.description || product.desc}</p>
                    <hr className="product-info-hr" />

                    <div className="product-info-selections">
                        <div className="product-info-color-row">
                            {t('product_details.colours')}
                            <span className="product-color-dot product-color-blue"></span>
                            <span className="product-color-dot product-color-red"></span>
                        </div>
                        <div className="product-info-size-row">
                            {t('product_details.size')} {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                                <button key={s} className={`product-size-btn ${s === 'M' ? 'product-size-active' : ''}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="product-info-actions">
                        <div className="product-quantity-selector">
                            <button onClick={() => setCount(Math.max(1, count - 1))}>-</button>
                            <span>{count}</span>
                            <button className="product-plus-btn" onClick={() => setCount(count + 1)}>+</button>
                        </div>
                        <button className="product-buy-btn" onClick={async () => { try { await dispatch(addToCart({...product, quantity: count})).unwrap(); toast.success(t('notifications.addedToCart')); } catch(e) { toast.error(t('notifications.error_msg')); } }}>{t('product_details.buyNow')}</button>
                        <button
                            className="product-wishlist-btn"
                            onClick={handleWishlistToggle}
                            style={{ borderColor: isFavorite ? "#DB4444" : "#ccc" }}
                        >
                            <Heart
                                size={20}
                                fill={isFavorite ? "#DB4444" : "none"}
                                color={isFavorite ? "#DB4444" : "currentColor"}
                            />
                        </button>
                    </div>

                    <div className="product-delivery-info">
                        <div className="product-delivery-item">
                            <Truck size={24} />
                            <div>
                                <p>{t('product_details.freeDelivery')}</p>
                                <span>{t('product_details.postalCode')}</span>
                            </div>
                        </div>
                        <div className="product-delivery-item">
                            <RefreshCw size={24} />
                            <div>
                                <p>{t('product_details.returnDelivery')}</p>
                                <span>{t('product_details.returnText')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;