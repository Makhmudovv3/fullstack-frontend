import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Section1.css';
import api from '../../services/api';

// Fallback images in case DB has no URLs
import DefaultIphone from "../../assets/Iphone.png";
import DefaultApple from "../../assets/apple.png";

const Section1 = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('/banners');
                if (response.data && response.data.length > 0) {
                    setBanners(response.data);
                } else {
                    // Fallback to a default structure if no banners are returned
                    setBanners([
                        {
                            id: 1,
                            title: t('hero.voucher'),
                            subtitle: t('hero.iphone'),
                            image: DefaultIphone,
                            logo: DefaultApple,
                            link: '#'
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, [t]);

    const getImage = (imgStr, defaultImg) => {
        if (!imgStr) return defaultImg;
        if (imgStr.startsWith('http') || imgStr.startsWith('/') || imgStr.startsWith('data:image')) return imgStr;
        if (imgStr === 'Iphone.png') return DefaultIphone;
        if (imgStr === 'apple.png') return DefaultApple;
        return defaultImg; // Fallback to default if it's an invalid string like 'png' or 'Exclusive'
    };

    return (
        <section className="section1-main">
            <div className="section1-container">
                <div className="section1-sidebar">
                    <div className="section1-menu-item">{t('categories.woman')} <ChevronRight size={18} /></div>
                    <div className="section1-menu-item">{t('categories.men')} <ChevronRight size={18} /></div>
                    <div className="section1-menu-item">{t('categories.electronics')}</div>
                    <div className="section1-menu-item">{t('categories.home')}</div>
                    <div className="section1-menu-item">{t('categories.medicine')}</div>
                    <div className="section1-menu-item">{t('categories.sports')}</div>
                    <div className="section1-menu-item">{t('categories.baby')}</div>
                    <div className="section1-menu-item">{t('categories.groceries')}</div>
                    <div className="section1-menu-item">{t('categories.health')}</div>
                </div>

                <div className="section1-banner">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        className="mySwiper"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <div className="section1-slide-content">
                                    <div className="section1-text-side">
                                        <div className="section1-apple">
                                            <img src={getImage(banner.logo, DefaultApple)} alt="logo" />
                                            <span>{banner.subtitle || t('hero.iphone')}</span>
                                        </div>
                                        <h1>{banner.title || t('hero.voucher')}</h1>
                                        <a href={banner.link || '#'} className="section1-shop-link">
                                            <span className="shop-text">{t('hero.shopNow')}</span>
                                            <ArrowRight size={24} className="shop-arrow" />
                                        </a>
                                    </div>
                                    <div className="section1-img-side">
                                        <img src={getImage(banner.image, DefaultIphone)} alt="banner" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Section1;