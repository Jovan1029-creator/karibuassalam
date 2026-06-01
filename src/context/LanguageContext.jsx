// src\context\LanguageContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SUPPORTED_LANGUAGES, translateText, uiMessages } from "../data/i18n";

const LanguageContext = createContext(null);
const STORAGE_KEY = "karibuassalam-lang";

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && uiMessages[stored]) return stored;
  const browser = window.navigator.language?.slice(0, 2).toLowerCase();
  return uiMessages[browser] ? browser : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t: uiMessages[language] ?? uiMessages.en,
      tx: (text) => translateText(language, text),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
