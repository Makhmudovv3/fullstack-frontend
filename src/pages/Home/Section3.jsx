import React from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Monitor, Watch, Camera, Headphones, Gamepad, ArrowLeft, ArrowRight } from 'lucide-react';
import './Section3.css';

const Section3 = ({ activeCategory, setActiveCategory }) => {
    const { t } = useTranslation();

    const categories = [
        { name: "Phones", icon: <Smartphone size={40} strokeWidth={1.5} /> },
        { name: "Computers", icon: <Monitor size={40} strokeWidth={1.5} /> },
        { name: "SmartWatch", icon: <Watch size={40} strokeWidth={1.5} /> },
        { name: "Camera", icon: <Camera size={40} strokeWidth={1.5} /> },
        { name: "HeadPhones", icon: <Headphones size={40} strokeWidth={1.5} /> },
        { name: "Gaming", icon: <Gamepad size={40} strokeWidth={1.5} /> },
    ];

    return (
        <section className="section3-main">
            <div className="section3-header">
                <div className="section3-title-box">
                    <div className="section3-red-label">{t('section3.redLabel')}</div>
                    <h2 className="section3-browse-title">{t('section3.title')}</h2>
                </div>
                <div className="section3-slider-btns">
                    <button className="section3-cat-nav"><ArrowLeft size={24} /></button>
                    <button className="section3-cat-nav"><ArrowRight size={24} /></button>
                </div>
            </div>

            <div className="section3-categories-grid">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className={`section3-category-card ${activeCategory === cat.name ? 'section3-active' : ''}`}
                        onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        {cat.icon}
                        <span className="section3-cat-name">
                            {t(`section3.catNames.${cat.name}`)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Section3;
