import i18next from "i18next";

export const defaultLocale = "en";
export const locales = ["en", "es", "fr", "de", "ja"];

export function initI18n() {
  i18next.init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Progravity",
        },
      },
    },
  });
  return i18next;
}
