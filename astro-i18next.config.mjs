/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLocale: "en",
  locales: ["en", "hi", "zh"],
  routes: {
    zh: {
      about: "a-propos",
      "contact-us": "contactez-nous",
      products: {
        index: "produits",
        categories: "categories",
      },
    },
    hi: {
      about: "a-proposito",
      "contact-us": "contactenos",
      products: {
        index: "productos",
        categories: "categorias",
      },
    },
  },
};
