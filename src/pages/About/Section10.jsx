import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaStore, FaDollarSign, FaShoppingBag } from 'react-icons/fa';
import { TbMoneybag } from "react-icons/tb";
import './Section10.css';

const Section10 = () => {
    const { t } = useTranslation();

    const stats = [
        { id: 1, icon: <FaStore size={40} />, count: "10.5k", label: t('about.stats_sellers') },
        { id: 2, icon: <FaDollarSign size={40} />, count: "33k", label: t('about.stats_monthly') },
        { id: 3, icon: <FaShoppingBag size={40} />, count: "45.5k", label: t('about.stats_customers') },
        { id: 4, icon: <TbMoneybag size={40} />, count: "25k", label: t('about.stats_annual') },
    ];

    return (
        <section className="section10-stats">
            {stats.map((stat) => (
                <div key={stat.id} className={`section10-card ${stat.active ? 'section10-active' : ''}`}>
                    <div className="section10-icon-outer">
                        <div className="section10-icon-inner">{stat.icon}</div>
                    </div>
                    <h2 className="section10-count">{stat.count}</h2>
                    <p className="section10-label">{stat.label}</p>
                </div>
            ))}
        </section>
    );
};

export default Section10;