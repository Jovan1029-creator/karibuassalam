import { useLanguage } from "../context/LanguageContext";
import { BOOKING_TYPES, CONTACT_METHODS, GUEST_LANGUAGES, ROOM_TYPES } from "../data/bookingOptions";
import { retreats } from "../data/retreats";

export function bookingNights(arrival, departure) {
  if (!arrival || !departure) return null;
  const days = (Date.parse(departure) - Date.parse(arrival)) / 86400000;
  return Number.isFinite(days) && days >= 0 ? Math.round(days) : null;
}

export function bookingDate(value, language) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const locale = { en: "en-GB", tr: "tr-TR", de: "de-DE" }[language] || "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export default function BookingSummary({ form }) {
  const { tx, language } = useLanguage();
  const optionLabel = (options, value) => tx(options.find((option) => option.value === value)?.label || "Not set");
  const retreat = retreats.find((item) => item.slug === form.retreatSlug);
  const rows = [
    { label: "Request type", value: optionLabel(BOOKING_TYPES, form.bookingType) },
    ...(form.bookingType === "retreat" ? [{ label: "Retreat or camp", value: tx(retreat?.title || "Not sure yet") }] : []),
    { label: "Arrival", value: bookingDate(form.arrivalDate, language) || tx("Not set") },
    { label: "Departure", value: bookingDate(form.departureDate, language) || tx("Not set") },
    { label: "Trip nights", value: bookingNights(form.arrivalDate, form.departureDate) ?? tx("Not set") },
    { label: "Adults", value: form.adults || tx("Not set") },
    { label: "Children", value: form.children || "0" },
    { label: "Room preference", value: optionLabel(ROOM_TYPES, form.roomType) },
    { label: "Preferred language", value: optionLabel(GUEST_LANGUAGES, form.guestLanguage) },
    { label: "Preferred contact", value: optionLabel(CONTACT_METHODS, form.preferredContact) },
    { label: "Airport pickup", value: form.airportPickup ? tx("Requested") : tx("Not requested") },
    ...[
      { label: "Your Name", value: form.name },
      { label: "Country", value: form.country },
      { label: "Your Email", value: form.email },
      { label: "Phone Number", value: form.phone },
      { label: "Dietary or access needs", value: form.dietaryNeeds, note: true },
      { label: "Message", value: form.message, note: true },
    ].filter((row) => row.value?.trim()),
  ];

  return (
    <section className="content-card booking-trip-card" aria-labelledby="trip-summary-title">
      <h3 id="trip-summary-title">{tx("Your trip so far")}</h3>
      <p className="booking-summary-hint">{tx("Updates as you complete the form.")}</p>
      <dl className="trip-summary">
        {rows.map((row) => (
          <div key={row.label} className={row.note ? "trip-summary-note" : undefined}>
            <dt>{tx(row.label)}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
