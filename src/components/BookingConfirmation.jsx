import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function BookingConfirmation({ record }) {
  const { tx } = useLanguage();
  const headingRef = useRef(null);
  const delivered = record?.storageMode === "supabase";

  useEffect(() => {
    // Put the next steps in view after a real successful submission, including
    // on mobile. Local fallbacks and validation errors must never get here.
    if (delivered) headingRef.current?.focus();
  }, [delivered, record?.id]);

  if (!delivered) return null;

  return (
    <section className="booking-confirmation" aria-labelledby="booking-next-title">
      <h3 id="booking-next-title" tabIndex={-1} ref={headingRef}>{tx("What happens next")}</h3>
      <ol className="next-steps">
        <li>{tx("The team reviews your dates and interests.")}</li>
        <li>{tx("We contact you using your preferred contact method.")}</li>
        <li>{tx("You receive the relevant details, availability and next steps.")}</li>
      </ol>
      {["retreat", "accommodation"].includes(record.bookingType) && (
        <p className="booking-confirmation-note">{tx("A 20% deposit confirms a camp booking. Individual stays can be paid on arrival.")}</p>
      )}
      <p className="booking-confirmation-note">{tx("This is a request, not a confirmed booking.")}</p>
    </section>
  );
}
