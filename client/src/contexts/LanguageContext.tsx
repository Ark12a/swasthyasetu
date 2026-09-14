import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "hi" | "te";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  languageLabel: string;
  t: (key: string, fallback?: string) => string;
};

const translations: Record<Exclude<Language, "en">, Record<string, string>> = {
  hi: {
    "nav.features": "सुविधाएँ",
    "nav.how": "यह कैसे काम करता है",
    "nav.doctors": "डॉक्टरों के लिए",
    "nav.about": "हमारे बारे में",
    "nav.doctorPortal": "डॉक्टर पोर्टल",
    "nav.getStarted": "शुरू करें",
    "hero.badge": "हर स्वास्थ्य बातचीत के लिए बनाया गया",
    "hero.titleA": "आपकी स्वास्थ्य कहानी,",
    "hero.titleB": "अब साफ़ सुनी जाएगी।",
    "hero.description": "SwasthyaSetu आपकी बात को एक स्पष्ट, साझा करने योग्य केस में बदलता है — आपकी भाषा में, आपकी गति से।",
    "hero.start": "अपनी स्वास्थ्य कहानी शुरू करें",
    "hero.how": "यह कैसे काम करता है",
    "feature.voice": "आवाज़ के साथ",
    "feature.ocr": "OCR तैयार",
    "feature.ayush": "AYUSH अनुकूल",
    "login.patient": "पेशेंट पोर्टल",
    "login.doctor": "डॉक्टर पोर्टल",
    "login.patientTitle": "अपनी देखभाल में वापस आएँ।",
    "login.doctorTitle": "डॉक्टर, आपका स्वागत है।",
    "login.signIn": "सुरक्षित रूप से साइन इन करें",
    "login.password": "पासवर्ड से लॉगिन",
    "login.otp": "OTP से लॉगिन",
    "login.switchPatient": "पेशेंट पोर्टल पर जाएँ",
    "login.switchDoctor": "डॉक्टर पोर्टल पर जाएँ",
    "dashboard.patient": "पेशेंट होम",
    "dashboard.greeting": "नमस्ते, आशा",
    "dashboard.checkin": "आज आप कैसा महसूस कर रही हैं?",
    "dashboard.startCase": "नया केस शुरू करें",
    "dashboard.doctorGreeting": "सुप्रभात, डॉ. मेहता।",
    "dashboard.doctor": "डॉक्टर वर्कस्पेस",
    "dashboard.overview": "अवलोकन",
    "dashboard.story": "मेरी स्वास्थ्य कहानी",
    "dashboard.documents": "दस्तावेज़",
    "dashboard.consultation": "डॉक्टर परामर्श",
    "dashboard.newCases": "नए केस",
    "dashboard.patients": "मरीज़",
    "dashboard.appointments": "अपॉइंटमेंट",
    "dashboard.reports": "रिपोर्ट",
    "dashboard.signOut": "साइन आउट",
    "dashboard.language": "भाषा",
  },
  te: {
    "nav.features": "ఫీచర్లు",
    "nav.how": "ఎలా పనిచేస్తుంది",
    "nav.doctors": "వైద్యుల కోసం",
    "nav.about": "మా గురించి",
    "nav.doctorPortal": "డాక్టర్ పోర్టల్",
    "nav.getStarted": "ప్రారంభించండి",
    "hero.badge": "ప్రతి ఆరోగ్య సంభాషణ కోసం రూపొందించబడింది",
    "hero.titleA": "మీ ఆరోగ్య కథ,",
    "hero.titleB": "స్పష్టంగా వినబడుతుంది.",
    "hero.description": "SwasthyaSetu మీరు చెప్పేదాన్ని మీ భాషలో, మీ వేగంతో, డాక్టర్ ఉపయోగించగల స్పష్టమైన కేసుగా మారుస్తుంది.",
    "hero.start": "మీ ఆరోగ్య కథను ప్రారంభించండి",
    "hero.how": "ఎలా పనిచేస్తుంది",
    "feature.voice": "వాయిస్‌తో",
    "feature.ocr": "OCR సిద్ధంగా ఉంది",
    "feature.ayush": "AYUSH అనుకూలం",
    "login.patient": "పేషెంట్ పోర్టల్",
    "login.doctor": "డాక్టర్ పోర్టల్",
    "login.patientTitle": "మీ సంరక్షణకు తిరిగి రండి.",
    "login.doctorTitle": "డాక్టర్, స్వాగతం.",
    "login.signIn": "సురక్షితంగా సైన్ ఇన్ చేయండి",
    "login.password": "పాస్‌వర్డ్ లాగిన్",
    "login.otp": "OTP లాగిన్",
    "login.switchPatient": "పేషెంట్ పోర్టల్‌కు వెళ్లండి",
    "login.switchDoctor": "డాక్టర్ పోర్టల్‌కు వెళ్లండి",
    "dashboard.patient": "పేషెంట్ హోమ్",
    "dashboard.greeting": "నమస్తే, ఆశా",
    "dashboard.checkin": "ఈ రోజు మీకు ఎలా అనిపిస్తోంది?",
    "dashboard.startCase": "కొత్త కేసును ప్రారంభించండి",
    "dashboard.doctorGreeting": "శుభోదయం, డా. మెహతా.",
    "dashboard.doctor": "డాక్టర్ వర్క్‌స్పేస్",
    "dashboard.overview": "అవలోకనం",
    "dashboard.story": "నా ఆరోగ్య కథ",
    "dashboard.documents": "పత్రాలు",
    "dashboard.consultation": "డాక్టర్ సంప్రదింపు",
    "dashboard.newCases": "కొత్త కేసులు",
    "dashboard.patients": "పేషెంట్లు",
    "dashboard.appointments": "అపాయింట్‌మెంట్లు",
    "dashboard.reports": "రిపోర్టులు",
    "dashboard.signOut": "సైన్ అవుట్",
    "dashboard.language": "భాష",
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem("swasthya-language") as Language) || "en");
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem("swasthya-language", next);
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    languageLabel: language === "hi" ? "हिन्दी" : language === "te" ? "తెలుగు" : "English",
    t: (key: string, fallback = key) => language === "en" ? fallback : translations[language][key] || fallback,
  }), [language]);
  useEffect(() => { document.documentElement.lang = language === "hi" ? "hi" : language === "te" ? "te" : "en"; }, [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
