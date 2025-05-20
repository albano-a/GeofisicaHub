import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import pt from "./locales/pt/translation.json";
import fr from "./locales/fr/translation.json";
import es from "./locales/es/translation.json";
import it from "./locales/it/translation.json";
import de from "./locales/de/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    fr: { translation: fr }, // Adicione outros idiomas conforme necessário
    es: { translation: es },
    it: { translation: it },
    de: { translation: de },
  },
  lng: "en", // idioma padrão
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
