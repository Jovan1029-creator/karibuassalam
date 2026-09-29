import CTAButton from "./CTAButton";
import { buildWhatsAppUrl } from "../utils/contact";
import { useLanguage } from "../context/LanguageContext";

export default function WhatsAppButton({ payload, label = "WhatsApp Us", asLink = false, ...rest }) {
  const { tx } = useLanguage();
  const href = buildWhatsAppUrl(payload);

  // Where WhatsApp is a secondary path it reads as a link, so each page keeps
  // one obvious primary button.
  if (asLink) {
    return (
      <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
        {tx(label)}
      </a>
    );
  }

  return (
    <CTAButton href={href} newTab {...rest}>
      {label}
    </CTAButton>
  );
}
