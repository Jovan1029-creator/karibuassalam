import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle({ compact = false }) {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <fieldset className={`lang-toggle ${compact ? "compact" : ""}`}>
      <legend className="visually-hidden">{t.nav.language}</legend>
      {languages.map((lang) => (
        <button
          type="button"
          key={lang.code}
          className={language === lang.code ? "is-active" : ""}
          aria-pressed={language === lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.label}
        >
          {lang.shortLabel}
        </button>
      ))}
    </fieldset>
  );
}
