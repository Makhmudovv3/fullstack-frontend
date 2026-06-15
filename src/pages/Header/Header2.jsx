import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ShoppingBag, XCircle, Star, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/shopSlice';
import './Header2.css';

import Gamepad from "../../assets/Gamepad.png";
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
import GamepadImg from "../../assets/img7.png";
import Jacket from "../../assets/img8.png";

const Header2 = () => {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);

    const user = useSelector((state) => state.shop.user);
    const dispatch = useDispatch();

    const wishlist = useSelector((state) => state.shop.wishlist || []);
    const cart = useSelector((state) => state.shop.cart || []);
    const cartCount = Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;

    const profileRef = useRef(null);
    const langRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
        navigate("/login");
    };

    const products = useMemo(() => [
        { id: 1, name: t('products.gamepad'), img: Gamepad },
        { id: 2, name: t('products.keyboard'), img: Keyboard },
        { id: 3, name: t('products.monitor'), img: Monitor },
        { id: 4, name: t('products.chair'), img: Chair },
        { id: 5, name: t('bestSellers.coat'), img: Coat },
        { id: 6, name: t('bestSellers.bag'), img: Bag },
        { id: 7, name: t('bestSellers.cooler'), img: Cooler },
        { id: 8, name: t('bestSellers.shelf'), img: Shelf },
        { id: 9, name: t('products_list.dogFood'), img: DogFood },
        { id: 10, name: t('products_list.camera'), img: Camera },
        { id: 11, name: t('products_list.laptop'), img: Laptop },
        { id: 12, name: t('products_list.curology'), img: Curology },
        { id: 13, name: t('products_list.car'), img: Car },
        { id: 14, name: t('products_list.shoes'), img: Shoes },
        { id: 15, name: t('products_list.gamepad'), img: GamepadImg },
        { id: 16, name: t('products_list.jacket'), img: Jacket },
    ], [t]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
            if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target)) setShowResults(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLang = (lang) => {
        i18n.changeLanguage(lang.toLowerCase());
        setIsLangOpen(false);
    };

    const filteredProducts = products.filter(p =>
        p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <header className="header2-nav">
            <div className="header2-container">
                <div className="header2-left-section">
                    <button className="header2-hamburger" onClick={() => setIsMenuOpen(true)}>
                        <Menu size={28} />
                    </button>
                    <Link to="/" className="header2-logo">Exclusive</Link>
                </div>

                <div className="header2-nav-center">
                    <nav className={`header2-nav-wrapper ${isMenuOpen ? 'active' : ''}`}>
                        <div className="mobile-only-header">
                            <span className="menu-text">{t('footer.shop')}</span>
                            <X size={28} onClick={() => setIsMenuOpen(false)} />
                        </div>
                        <ul className="header2-nav-links">
                            <li><NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.home')}</NavLink></li>
                            <li><NavLink to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.contact')}</NavLink></li>
                            <li><NavLink to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.about')}</NavLink></li>
                            {!user && (
                                <>
                                    <li><NavLink to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('auth.loginLink')}</NavLink></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                <div className="header2-right-section">
                    <div className="header2-search-container" ref={searchRef}>
                        <input
                            type="text"
                            placeholder={t('header.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowResults(e.target.value.length > 0);
                            }}
                        />
                        <Search size={20} className="search-icon" />

                        {showResults && (
                            <div className="search-results-dropdown">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <div key={product.id} className="search-result-item" onClick={() => { setShowResults(false); setSearchTerm(""); navigate(`/product/${product.id}`); }}>
                                            <img src={product.img} alt="" />
                                            <span>{product.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-result">No results</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="header2-action-icons">
                        <div className="lang-selector-wrapper" ref={langRef}>
                            <div className="lang-current" onClick={() => setIsLangOpen(!isLangOpen)}>
                                {i18n.language.toUpperCase()} <ChevronDown size={14} />
                            </div>
                            {isLangOpen && (
                                <div className="lang-dropdown">
                                    <div className="lang-item" onClick={() => changeLang('UZ')}>UZ</div>
                                    <div className="lang-item" onClick={() => changeLang('RU')}>RU</div>
                                    <div className="lang-item" onClick={() => changeLang('EN')}>EN</div>
                                </div>
                            )}
                        </div>

                        <Link to="/wishlist" className="icon-item" style={{ position: 'relative' }}>
                            <Heart size={24} />
                            {wishlist.length > 0 && (
                                <span className="header-badge">{wishlist.length}</span>
                            )}
                        </Link>

                        <Link to="/cart" className="icon-item" style={{ position: 'relative' }}>
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="header-badge">{cartCount}</span>
                            )}
                        </Link>

                        {user && (
                            <div className="header2-profile-wrapper" ref={profileRef}>
                                <button className={`profile-icon-btn ${isProfileOpen ? 'active' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                    <User size={24} />
                                </button>

                                {isProfileOpen && (
                                    <div className="profile-dropdown-menu">
                                        {user?.isAdmin && (
                                            <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate("/admin") }}>
                                                <Star size={20} /> <span>Admin Panel</span>
                                            </div>
                                        )}
                                        <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate("/account", { state: { tab: 'profile' } }) }}>
                                            <User size={20} /> <span>{t('header.profile.manage')}</span>
                                        </div>
                                        <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate("/account", { state: { tab: 'orders' } }) }}>
                                            <ShoppingBag size={20} /> <span>{t('header.profile.orders')}</span>
                                        </div>
                                        <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate("/account", { state: { tab: 'cancellations' } }) }}>
                                            <XCircle size={20} /> <span>{t('header.profile.cancellations')}</span>
                                        </div>
                                        <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate("/account", { state: { tab: 'reviews' } }) }}>
                                            <Star size={20} /> <span>{t('header.profile.reviews')}</span>
                                        </div>
                                        <div className="profile-menu-item logout-item" onClick={handleLogout}>
                                            <LogOut size={20} /> <span>{t('header.profile.logout')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header2;
