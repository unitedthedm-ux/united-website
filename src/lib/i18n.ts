export type Locale = "en" | "ar";

export const defaultLocale: Locale = "ar";

export const locales: Locale[] = ["en", "ar"];

export const translations = {
  en: {
    brand: "UNITED",
    tagline: "Premium Real Estate in Egypt",
    nav: {
      home: "Home",
      properties: "Properties",
      resale: "Resale",
      media: "Media",
      about: "About",
      contact: "Contact",
    },
    hero: {
      headline: "Find Your Dream Property",
      sub: "Premium new developments and exclusive resale units across Egypt's finest locations.",
      search: "Search properties...",
      cta: "Browse Properties",
      ctaResale: "View Resale Units",
    },
    sections: {
      featured: "Featured Properties",
      featuredSub: "Hand-picked premium units",
      resale: "Resale Units",
      resaleSub: "Exclusive resale inventory from verified owners",
      regions: "Browse by Location",
      regionsSub: "Explore Egypt's most sought-after areas",
      media: "Our Latest Videos",
      mediaSub: "Follow our social channels for the latest updates",
      viewAll: "View All",
    },
    property: {
      beds: "Beds",
      baths: "Baths",
      area: "Area",
      price: "Price",
      downPayment: "Down Payment",
      monthly: "Monthly",
      fullPrice: "Full Price",
      askPrice: "Ask for Price",
      whatsapp: "WhatsApp Inquiry",
      sqm: "sqm",
      type: "Type",
      compound: "Compound",
      finishing: "Finishing",
      delivery: "Delivery",
      viewDetails: "View Details",
    },
    resalePage: {
      title: "Resale Units",
      sub: "Exclusive resale properties from verified owners",
      filter: "Filter",
      sortBy: "Sort by",
    },
    mediaPage: {
      title: "Media Gallery",
      sub: "Watch our latest property tours and brand videos",
    },
    footer: {
      rights: "All rights reserved.",
      madeBy: "Built by",
    },
    common: {
      loading: "Loading...",
      noResults: "No results found",
      learnMore: "Learn More",
      back: "Back",
    },
  },
  ar: {
    brand: "يونايتد",
    tagline: "عقارات فاخرة في مصر",
    nav: {
      home: "الرئيسية",
      properties: "العقارات",
      resale: "إعادة البيع",
      media: "الميديا",
      about: "عن الشركة",
      contact: "تواصل معنا",
    },
    hero: {
      headline: "اعثر على عقار أحلامك",
      sub: "مشاريع جديدة فاخرة ووحدات إعادة بيع حصرية في أرقى مناطق مصر.",
      search: "ابحث عن عقار...",
      cta: "تصفح العقارات",
      ctaResale: "وحدات إعادة البيع",
    },
    sections: {
      featured: "عقارات مميزة",
      featuredSub: "وحدات فاخرة مختارة بعناية",
      resale: "وحدات إعادة البيع",
      resaleSub: "مخزون حصري من ملاك موثوقين",
      regions: "تصفح حسب الموقع",
      regionsSub: "استكشف أرقى المناطق في مصر",
      media: "أحدث مقاطعنا",
      mediaSub: "تابع قنواتنا على السوشيال ميديا",
      viewAll: "عرض الكل",
    },
    property: {
      beds: "غرف",
      baths: "حمامات",
      area: "المساحة",
      price: "السعر",
      downPayment: "المقدم",
      monthly: "شهريًا",
      fullPrice: "السعر الكامل",
      askPrice: "اسأل عن السعر",
      whatsapp: "استفسار واتساب",
      sqm: "م²",
      type: "النوع",
      compound: "الكمبوند",
      finishing: "التشطيب",
      delivery: "موعد التسليم",
      viewDetails: "عرض التفاصيل",
    },
    resalePage: {
      title: "وحدات إعادة البيع",
      sub: "عقارات إعادة بيع حصرية من ملاك موثوقين",
      filter: "تصفية",
      sortBy: "ترتيب حسب",
    },
    mediaPage: {
      title: "معرض الميديا",
      sub: "شاهد أحدث جولاتنا العقارية ومقاطع الفيديو",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      madeBy: "بناء بواسطة",
    },
    common: {
      loading: "جاري التحميل...",
      noResults: "لا توجد نتائج",
      learnMore: "اعرف أكثر",
      back: "رجوع",
    },
  },
};

export type TranslationKeys = typeof translations.en;

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations.en;
}

export function isRTL(locale: Locale) {
  return locale === "ar";
}
