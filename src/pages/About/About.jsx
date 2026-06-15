import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Section9 from './Section9';
import Section10 from './Section10';
import Section11 from './Section11';
import Section12 from './Section12';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="about-page-wrapper" style={{ maxWidth: '1170px', width: '100%', margin: '80px auto', padding: '0 15px', overflowX: 'hidden' }}>
            <div className="about-breadcrumb" style={{ marginBottom: '40px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#7D8184' }}>{t('about.home')}</Link>
                <span style={{ margin: '0 10px', color: '#7D8184' }}>/</span>
                <span style={{ color: '#000' }}>{t('about.title')}</span>
            </div>

            <Section9 />
            <Section10 />
            <Section11 />
            <Section12 />
        </div>
    );
};

export default About;