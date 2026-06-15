import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from "./pages/locales/eng.json";
import ru from "./pages/locales/ru.json";
import uz from "./pages/locales/uzb.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            uz: { translation: uz },
            ru: { translation: ru }
        },
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage']
        },
        interpolation: { escapeValue: false }
    });

export default i18n;