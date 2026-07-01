import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'NeverAlone',
      slogan: 'Never travel alone.',
      heroTitle: 'Find people nearby tonight.',
      heroSubtitle: 'Meet travelers, digital nomads and locals around you. Safe, simple and not a dating app.',
      primaryAction: 'Start exploring',
      nearbyTitle: 'Nearby radius',
      activitiesTitle: 'Choose your vibe',
      safetyTitle: 'Safety first',
      safetyText: 'Ratings, report, block, email and phone verification are part of the product baseline.',
      aiTitle: 'AI Companion',
      aiText: 'When nobody is nearby, NeverAlone helps you plan, translate and stay safe.'
    }
  },
  cs: {
    translation: {
      appName: 'NeverAlone',
      slogan: 'Never travel alone.',
      heroTitle: 'Najdi lidi poblíž už dnes večer.',
      heroSubtitle: 'Potkávej cestovatele, digitální nomády a místní lidi kolem sebe. Bezpečně, jednoduše a není to seznamka.',
      primaryAction: 'Začít objevovat',
      nearbyTitle: 'Radius poblíž',
      activitiesTitle: 'Vyber aktivitu',
      safetyTitle: 'Bezpečnost na prvním místě',
      safetyText: 'Hodnocení, report, block, email a telefon verifikace jsou základ produktu.',
      aiTitle: 'AI Companion',
      aiText: 'Když nikdo není poblíž, NeverAlone pomůže s plánem, překladem a bezpečností.'
    }
  }
};

const languageCode = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: languageCode === 'cs' ? 'cs' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
