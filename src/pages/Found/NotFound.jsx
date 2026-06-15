import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="notfound-container">
            <div className="breadcrumb">
                <Link to="/" className="breadcrumb-link">{t('not_found.breadcrumbHome')}</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{t('not_found.breadcrumbError')}</span>
            </div>

            <div className="notfound-content">
                <h1 className="notfound-title">{t('not_found.title')}</h1>
                <p className="notfound-text">
                    {t('not_found.text')}
                </p>

                <Link to="/" className="back-home-btn">
                    {t('not_found.backBtn')}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;