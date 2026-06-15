import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import './Section12.css';

const Section12 = () => {
    const { t } = useTranslation();
    return (
        <section className="section12-services">
            <div className="section12-item">
                <div className="section12-icon-box"><Truck size={40} /></div>
                <h3 className="section12-h">{t('about.service_delivery_h')}</h3>
                <p className="section12-p">{t('about.service_delivery_p')}</p>
            </div>
            <div className="section12-item">
                <div className="section12-icon-box"><Headphones size={40} /></div>
                <h3 className="section12-h">{t('about.service_support_h')}</h3>
                <p className="section12-p">{t('about.service_support_p')}</p>
            </div>
            <div className="section12-item">
                <div className="section12-icon-box"><ShieldCheck size={40} /></div>
                <h3 className="section12-h">{t('about.service_secure_h')}</h3>
                <p className="section12-p">{t('about.service_secure_p')}</p>
            </div>
        </section>
    );
};

export default Section12;