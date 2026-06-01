// src\utils\contact.js
import { SITE } from "../data/siteConfig";
import { translateText } from "../data/i18n";

function clean(value) {
  return String(value ?? "").trim();
}

export function buildContactMessage(payload = {}) {
  const language = clean(payload.language) || "en";
  const rawIntent = clean(payload.intent) || "contact";
  const intent =
    rawIntent === "booking"
      ? translateText(language, "Booking Request")
      : rawIntent === "contact"
        ? translateText(language, "Contact Request")
        : clean(payload.intent) || translateText(language, "General inquiry");
  const retreatTitle = clean(payload.retreatTitle);
  const name = clean(payload.name);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const message = clean(payload.message);

  return [
    `${translateText(language, "Hello")} ${SITE.brandName},`,
    "",
    `${translateText(language, "Intent")}: ${intent}`,
    retreatTitle ? `${translateText(language, "Selected retreat")}: ${retreatTitle}` : null,
    name ? `${translateText(language, "Name")}: ${name}` : null,
    email ? `${translateText(language, "Email")}: ${email}` : null,
    phone ? `${translateText(language, "Phone")}: ${phone}` : null,
    "",
    translateText(language, "Message:"),
    message || translateText(language, "Please share availability and next steps."),
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWhatsAppUrl(payload = {}) {
  return `https://wa.me/${SITE.whatsAppPhone}?text=${encodeURIComponent(
    buildContactMessage(payload)
  )}`;
}

export function buildMailtoUrl(payload = {}) {
  const language = clean(payload.language) || "en";
  const intent =
    clean(payload.intent) === "booking"
      ? translateText(language, "Booking Request")
      : translateText(language, "Contact Request");
  const retreatTitle = clean(payload.retreatTitle);
  const subject = retreatTitle ? `${intent} - ${retreatTitle}` : intent;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    buildContactMessage(payload)
  )}`;
}

export async function sendEmailApiStub(payload = {}) {
  void payload;
  return Promise.reject(
    new Error("No email API is configured. Use WhatsApp or Send via Email (mailto).")
  );
}
