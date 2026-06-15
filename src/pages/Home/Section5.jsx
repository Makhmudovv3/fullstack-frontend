import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Section5.css';
import api from '../../services/api';

// Fallback image
import DefaultMusic from "../../assets/music.png";

const Section5 = () => {
  const { t } = useTranslation();
  const [promo, setPromo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, mins: 0, secs: 0
  });

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await api.get('/promos');
        if (response.data && response.data.length > 0) {
          setPromo(response.data[response.data.length - 1]); // Take the latest promo
        }
      } catch (error) {
        console.error("Error fetching promo:", error);
      }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    let targetDateValue;
    if (promo && promo.targetDate) {
      targetDateValue = new Date(promo.targetDate).getTime();
    } else {
      // Fallback target date if no promo is loaded
      targetDateValue = Date.now() + (5 * 86400000) + (23 * 3600000) + (59 * 60000) + (35 * 1000);
    }

    const timer = setInterval(() => {
      const diff = targetDateValue - Date.now();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  const getImage = (imgStr) => {
    if (!imgStr) return DefaultMusic;
    if (imgStr.startsWith('http') || imgStr.startsWith('/') || imgStr.startsWith('data:image')) return imgStr;
    if (imgStr === 'music.png') return DefaultMusic;
    return DefaultMusic; 
  };

  const renderCircle = (num, labelKey) => (
    <div className="product-timer-circle">
      <span className="product-timer-num">{String(num || 0).padStart(2, '0')}</span>
      <span className="product-timer-text">{t(`section5.timer.${labelKey}`)}</span>
    </div>
  );

  return (
    <section className="product-section5">
      <div className="product-section5-container">
        <div className="product-section5-content">
          <span className="product-section5-category">{promo?.category || t('section5.category')}</span>
          <h2 className="product-section5-title">{promo?.title || t('section5.title')}</h2>

          <div className="product-section5-timer">
            {renderCircle(timeLeft.days, 'days')}
            {renderCircle(timeLeft.hours, 'hours')}
            {renderCircle(timeLeft.mins, 'mins')}
            {renderCircle(timeLeft.secs, 'secs')}
          </div>

          <a href={promo?.link || '#'} className="product-section5-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
            {t('section5.buyNow')}
          </a>
        </div>
        <div className="product-section5-image">
          <img src={getImage(promo?.image)} alt="Speaker Promo" />
        </div>
      </div>
    </section>
  );
};

export default Section5;