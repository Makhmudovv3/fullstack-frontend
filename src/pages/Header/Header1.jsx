import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import './Header1.css';

const Header1 = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLangDisplay = {
        en: 'English',
        ru: 'Russian',
        uz: 'Uzbek'
    }[i18n.language] || 'English';

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="header1-top-bar">
            <div className="header1-container">
                <div className="header1-content">
                    <p className="header1-sale-text">
                        {t('top_bar_sale_text')}
                        <a href="#" className="header1-shop-now">{t('shopNow')}</a>
                    </p>
                </div>

                <div className="header1-language-wrapper">
                    <div className="header1-language-selector" onClick={() => setIsOpen(!isOpen)}>
                        <span>{currentLangDisplay}</span>
                        <ChevronDown size={14} className={`header1-dropdown-icon ${isOpen ? 'open' : ''}`} />
                    </div>

                    {isOpen && (
                        <ul className="header1-language-dropdown">
                            <li onClick={() => changeLanguage('en')}>English</li>
                            <li onClick={() => changeLanguage('ru')}>Russian</li>
                            <li onClick={() => changeLanguage('uz')}>Uzbek</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header1;