import React from 'react';
import { useTranslation } from 'react-i18next';
import './Section9.css';
import aboutimg from "../../assets/About-img.png"

const Section9 = () => {
    const { t } = useTranslation();
    return (
        <section className="section9-story">
            <div className="section9-content">
                <h1 className="section9-title">{t('about.story_title')}</h1>
                <p className="section9-text">{t('about.story_p1')}</p>
                <p className="section9-text">{t('about.story_p2')}</p>
            </div>
            <div className="section9-image-container">
                <img src={aboutimg} alt="Story" className="section9-img" />
            </div>
        </section>
    );
};

export default Section9;