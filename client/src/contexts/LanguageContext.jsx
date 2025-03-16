import { createContext, useState, useContext, useEffect } from 'react';

// Available languages from Sarvam AI API
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' }
];

// Translations for common UI elements
const translations = {
  en: {
    welcome: "Welcome to Quickcred",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    chat: "Chat",
    home: "Home",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    createAccount: "Create Account",
    welcomeBack: "Welcome Back",
    signInToContinue: "Sign in to continue to Quickcred",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    joinToday: "Join Quickcred today",
    chatAssistant: "Quickcred Assistant",
    typeMessage: "Type your message...",
    send: "Send",
    selectLanguage: "Select Language",
    loading: "Loading...",
  },
  hi: {
    welcome: "क्विकक्रेड में आपका स्वागत है",
    login: "लॉग इन",
    signup: "साइन अप",
    logout: "लॉग आउट",
    chat: "चैट",
    home: "होम",
    email: "ईमेल पता",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    fullName: "पूरा नाम",
    createAccount: "खाता बनाएं",
    welcomeBack: "वापसी पर स्वागत है",
    signInToContinue: "क्विकक्रेड जारी रखने के लिए साइन इन करें",
    dontHaveAccount: "खाता नहीं है?",
    alreadyHaveAccount: "पहले से ही एक खाता है?",
    joinToday: "आज ही क्विकक्रेड से जुड़ें",
    chatAssistant: "क्विकक्रेड सहायक",
    typeMessage: "अपना संदेश लिखें...",
    send: "भेजें",
    selectLanguage: "भाषा चुनें",
    loading: "लोड हो रहा है...",
  },
  bn: {
    welcome: "কুইকক্রেডে আপনাকে স্বাগতম",
    login: "লগইন",
    signup: "সাইন আপ",
    logout: "লগআউট",
    chat: "চ্যাট",
    home: "হোম",
    email: "ইমেল ঠিকানা",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    fullName: "পুরো নাম",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    welcomeBack: "ফিরে আসার জন্য স্বাগতম",
    signInToContinue: "কুইকক্রেড চালিয়ে যেতে সাইন ইন করুন",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    alreadyHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    joinToday: "আজই কুইকক্রেডে যোগ দিন",
    chatAssistant: "কুইকক্রেড সহকারী",
    typeMessage: "আপনার বার্তা টাইপ করুন...",
    send: "পাঠান",
    selectLanguage: "ভাষা নির্বাচন করুন",
    loading: "লোড হচ্ছে...",
  },
  // Add more translations for other languages as needed
  // For brevity, I'm only including a few languages here
  // In a real application, you would include all 10 languages
};

// Default to English for languages without translations
const getTranslation = (langCode, key) => {
  if (translations[langCode] && translations[langCode][key]) {
    return translations[langCode][key];
  }
  return translations.en[key]; // Fallback to English
};

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Function to change the language
  const changeLanguage = (langCode) => {
    if (LANGUAGES.some(lang => lang.code === langCode)) {
      setLanguage(langCode);
    }
  };
  
  // Function to get a translated string
  const t = (key) => {
    return getTranslation(language, key);
  };
  
  const value = {
    language,
    changeLanguage,
    t,
    languages: LANGUAGES
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
} 