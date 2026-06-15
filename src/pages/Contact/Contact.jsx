import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = "8481072431:AAHUQjU2ZNd2b9MiuV1olxhRtAJha5lrGi4";
        const chat_id = "6205699347";

        const text = `
🚀 **Yangi xabar (Exclusive Store)**:
━━━━━━━━━━━━━━━━━
👤 **Ism:** ${formData.name}
📧 **Email:** ${formData.email}
📞 **Tel:** ${formData.phone}
💬 **Xabar:** ${formData.message}
━━━━━━━━━━━━━━━━━
        `;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chat_id,
                    text: text,
                    parse_mode: "Markdown"
                })
            });

            if (response.ok) {
                toast.success(t('contact.success_msg'));
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                toast.error(t('contact.error_msg'));
            }
        } catch (error) {
            toast.error(t('contact.network_error'));
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-breadcrumb">
                <Link to="/" className="breadcrumb-home" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t('contact.home')}
                </Link>
                <span className="breadcrumb-separator"> / </span>
                <span className="breadcrumb-current">{t('contact.title')}</span>
            </div>

            <div className="contact-wrapper">
                <div className="contact-info-card">
                    <div className="info-section">
                        <div className="info-header">
                            <div className="info-icon-wrapper"><Phone size={20} color="white" /></div>
                            <h3>{t('contact.callToUs')}</h3>
                        </div>
                        <p>{t('contact.availableInfo')}</p>
                        <p className="bold-text">Phone: +8801611112222</p>
                    </div>
                    <hr className="info-divider" />
                    <div className="info-section">
                        <div className="info-header">
                            <div className="info-icon-wrapper"><Mail size={20} color="white" /></div>
                            <h3>{t('contact.writeToUs')}</h3>
                        </div>
                        <p>{t('contact.emailInfo')}</p>
                        <p className="bold-text">Emails: customer@exclusive.com</p>
                        <p className="bold-text">Emails: support@exclusive.com</p>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder={t('contact.yourName')}
                            required
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder={t('contact.yourEmail')}
                            required
                        />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel"
                            placeholder={t('contact.yourPhone')}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t('contact.yourMessage')}
                            rows="8"
                        ></textarea>
                    </div>
                    <div className="form-footer">
                        <button type="submit" className="send-btn">
                            {t('contact.sendMessage')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contact;