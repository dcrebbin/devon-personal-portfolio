import en from "./public/locales/en/translation.json" assert { type: "json" };
import hi from "./public/locales/hi/translation.json" assert { type: "json" };
import zh from "./public/locales/zh/translation.json" assert { type: "json" };

/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLocale: "en",
  locales: ["en", "hi", "zh"],
  i18nextServer: {
    resources: {
      en: {
        translation: {
          ...en,
        },
      },
      hi: {
        translation: {
          ...hi,
        },
      },
      zh: {
        translation: {
          ...zh,
        },
      },
    },
  },
};
