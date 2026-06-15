import React from 'react';
import { useTranslation } from 'react-i18next';
import './Section7.css';
import ps5 from '../../assets/ps5.png';
import woman from '../../assets/woman.png';
import kalonka from '../../assets/kalonka.png';
import gucci from '../../assets/gucci.png';

const Section7 = () => {
  const { t } = useTranslation();

  return (
    <section className="section7-main-wrapper">
      <div className="section7-header-block">
        <div className="section7-badge-row">
          <div className="section7-red-indicator"></div>
          <span className="section7-badge-text">{t('section7.badge')}</span>
        </div>
        <h2 className="section7-main-title">{t('section7.title')}</h2>
      </div>

      <div className="section7-products-grid">
        <div className="section7-grid-card section7-card-large">
          <img src={ps5} alt="PS5" className="section7-card-img" />
          <div className="section7-card-overlay">
            <h3 className="section7-card-title">{t('section7.ps5.title')}</h3>
            <p className="section7-card-desc">{t('section7.ps5.desc')}</p>
            <button className="section7-shop-btn">{t('section7.shopNow')}</button>
          </div>
        </div>

        <div className="section7-grid-card section7-card-wide">
          <img src={woman} alt="Woman" className="section7-card-img" />
          <div className="section7-card-overlay">
            <h3 className="section7-card-title">{t('section7.woman.title')}</h3>
            <p className="section7-card-desc">{t('section7.woman.desc')}</p>
            <button className="section7-shop-btn">{t('section7.shopNow')}</button>
          </div>
        </div>

        <div className="section7-grid-card section7-card-small">
          <img src={kalonka} alt="Speakers" className="section7-card-img" />
          <div className="section7-card-overlay">
            <h3 className="section7-card-title">{t('section7.speakers.title')}</h3>
            <p className="section7-card-desc">{t('section7.speakers.desc')}</p>
            <button className="section7-shop-btn">{t('section7.shopNow')}</button>
          </div>
        </div>

        <div className="section7-grid-card section7-card-small">
          <img src={gucci} alt="Perfume" className="section7-card-img" />
          <div className="section7-card-overlay">
            <h3 className="section7-card-title">{t('section7.perfume.title')}</h3>
            <p className="section7-card-desc">{t('section7.perfume.desc')}</p>
            <button className="section7-shop-btn">{t('section7.shopNow')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section7;