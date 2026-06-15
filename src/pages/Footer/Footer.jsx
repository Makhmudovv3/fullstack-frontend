import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import './Footer.css';

import QrCodeImg from "../../assets/Qr.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-main">
      <div className="footer-container">

        <div className="footer-section">
          <h2 className="footer-logo">Exclusive</h2>
          <h3 className="footer-subtitle">{t('footer.subscribe')}</h3>
          <p className="footer-text">{t('footer.offer')}</p>
          <div className="footer-subscribe-box">
            <input type="email" placeholder={t('footer.emailPlaceholder')} />
            <Send size={20} className="footer-send-icon" />
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer.support')}</h3>
          <p className="footer-address">
            {t('footer.address')}
          </p>
          <p className="footer-email">exclusive@gmail.com</p>
          <p className="footer-phone">+88015-88888-9999</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer.account')}</h3>
          <ul className="footer-list">
            <li><Link to="/account">{t('footer.myAccount')}</Link></li>
            <li><Link to="/login">{t('footer.loginRegister')}</Link></li>
            <li><Link to="/cart">{t('footer.cart')}</Link></li>
            <li><Link to="/wishlist">{t('footer.wishlist')}</Link></li>
            <li><Link to="/">{t('footer.shop')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer.quickLink')}</h3>
          <ul className="footer-list">
            <li><Link to="#">{t('footer.privacyPolicy')}</Link></li>
            <li><Link to="#">{t('footer.termsOfUse')}</Link></li>
            <li><Link to="#">{t('footer.faq')}</Link></li>
            <li><Link to="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer.downloadApp')}</h3>
          <p className="footer-small-text">{t('footer.appOffer')}</p>

          <div className="footer-app-wrapper">
            <div className="footer-qr-code">
              <img src={QrCodeImg} alt="QR Code" />
            </div>
            <div className="footer-app-buttons">
              <button className="footer-app-btn">
                <FaGooglePlay className="footer-app-icon" />
                <div className="footer-app-text">
                  <span>GET IT ON</span>
                  <strong>{t('footer.googlePlay')}</strong>
                </div>
              </button>
              <button className="footer-app-btn">
                <FaApple className="footer-app-icon" />
                <div className="footer-app-text">
                  <span>Download on the</span>
                  <strong>{t('footer.appStore')}</strong>
                </div>
              </button>
            </div>
          </div>

          <div className="footer-social-icons">
            <Facebook size={24} />
            <Twitter size={24} />
            <Instagram size={24} />
            <Linkedin size={24} />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;