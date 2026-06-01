import { useMemo } from "react";
import { buildWhatsAppUrl } from "../utils/contact";
import { useLanguage } from "../context/LanguageContext";

export default function FloatingWhatsAppHelp() {
  const { tx, language } = useLanguage();

  const url = useMemo(
    () =>
      buildWhatsAppUrl({
        intent: "contact",
        language,
        message: tx("I need help with booking and travel information."),
      }),
    [language, tx]
  );

  return (
    <a
      className="floating-whatsapp"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tx("Need help with booking or travel plans? Message us on WhatsApp.")}
      title={tx("Need Help?")}
    >
      <span className="floating-whatsapp__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.53 0 .2 5.32.2 11.87c0 2.09.54 4.13 1.57 5.92L0 24l6.39-1.67a11.81 11.81 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.44-8.42Zm-8.44 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.79.99 1.01-3.7-.23-.38A9.9 9.9 0 0 1 2.18 11.87C2.18 6.42 6.63 1.98 12.08 1.98c2.64 0 5.13 1.03 6.99 2.89a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.9-9.88 9.9Zm5.43-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.76.97-.94 1.16-.17.2-.34.22-.64.08-.3-.15-1.27-.47-2.42-1.49a9.06 9.06 0 0 1-1.67-2.08c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.38s-1.04 1.02-1.04 2.5 1.06 2.9 1.2 3.1c.15.2 2.1 3.22 5.08 4.51.71.31 1.26.5 1.69.64.71.22 1.35.19 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
          />
        </svg>
      </span>
      <span className="floating-whatsapp__text">
        <strong>{tx("Need Help?")}</strong>
        <span>{tx("WhatsApp")}</span>
      </span>
    </a>
  );
}
