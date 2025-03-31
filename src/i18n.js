import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDEtector from "i18next-browser-languagedetector";

i18next
  .use(initReactI18next)
  .use(LanguageDEtector)
  .init({
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          hello: "Hello",
        },
      },
      es: {
        translation: {
          hello: "Hola",
        },
      },
    },
  });
