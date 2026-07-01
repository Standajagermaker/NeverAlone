import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
const resources = {
  en: { translation: { brand:{name:'NeverAlone',slogan:'Never travel alone.'}, tabs:{home:'Home',nearby:'Nearby',profile:'Profile',settings:'Settings'}, home:{headline:'Find people nearby tonight.', sub:'NeverAlone helps travelers, nomads and locals meet safely around real activities.', cta:'Create profile', ai:'AI Companion is ready when nobody is nearby.'}, profile:{title:'Your travel profile', save:'Save profile', name:'Name', bio:'Bio', country:'Country', languages:'Languages'}, nearby:{title:'Nearby', radius:'Radius', safety:'Safety first: report, block and verified profiles are part of the product baseline.'}, settings:{title:'Settings', theme:'Theme', language:'Language'} } },
  cs: { translation: { brand:{name:'NeverAlone',slogan:'Never travel alone.'}, tabs:{home:'Domů',nearby:'Okolí',profile:'Profil',settings:'Nastavení'}, home:{headline:'Najdi lidi poblíž už dnes večer.', sub:'NeverAlone pomáhá cestovatelům, nomádům a místním potkávat se bezpečně kolem konkrétních aktivit.', cta:'Vytvořit profil', ai:'AI Companion je připraven, když poblíž nikdo není.'}, profile:{title:'Tvůj cestovní profil', save:'Uložit profil', name:'Jméno', bio:'Bio', country:'Země', languages:'Jazyky'}, nearby:{title:'Okolí', radius:'Radius', safety:'Bezpečnost od základu: report, block a ověřené profily jsou součást baseline.'}, settings:{title:'Nastavení', theme:'Vzhled', language:'Jazyk'} } }
};
const deviceLanguage = Localization.getLocales()[0]?.languageCode === 'cs' ? 'cs' : 'en';
i18n.use(initReactI18next).init({ resources, lng: deviceLanguage, fallbackLng: 'en', interpolation: { escapeValue: false } });
export default i18n;
