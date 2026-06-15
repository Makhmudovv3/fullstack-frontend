import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import './Section8.css';

const Section8 = () => {
  const { t } = useTranslation();

  return (
    <section className="section8-main-wrapper">
      <div className="section8-container">
        <div className="section8-feature-item">
          <div className="section8-icon-outer">
            <div className="section8-icon-inner">
              <Truck size={40} color="white" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="section8-feature-title">{t('section8.deliveryTitle')}</h3>
          <p className="section8-feature-desc">{t('section8.deliveryDesc')}</p>
        </div>

        <div className="section8-feature-item">
          <div className="section8-icon-outer">
            <div className="section8-icon-inner">
              <Headphones size={40} color="white" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="section8-feature-title">{t('section8.serviceTitle')}</h3>
          <p className="section8-feature-desc">{t('section8.serviceDesc')}</p>
        </div>

        <div className="section8-feature-item">
          <div className="section8-icon-outer">
            <div className="section8-icon-inner">
              <ShieldCheck size={40} color="white" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="section8-feature-title">{t('section8.moneyTitle')}</h3>
          <p className="section8-feature-desc">{t('section8.moneyDesc')}</p>
        </div>
      </div>

      <div className="section8-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20V4M12 4L5 11M12 4L19 11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default Section8;