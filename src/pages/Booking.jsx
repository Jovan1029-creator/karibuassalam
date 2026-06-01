import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import CTAButton from "../components/CTAButton";
import { SITE } from "../data/siteConfig";
import { retreats } from "../data/retreats";
import {
  BOOKING_TYPES,
  CONTACT_METHODS,
  GUEST_LANGUAGES,
  ROOM_TYPES,
  PLANNING_CAPACITY,
} from "../data/bookingOptions";
import {
  analyzeBookingDraft,
  buildBookingMessage,
  getBookingBackendMode,
  saveBookingRequestRemote,
} from "../utils/bookingAutomation";
import { useLanguage } from "../context/LanguageContext";
import bookingImg from "../../pics/rooms/camps-22-768x576.webp";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function initialFormFromParams(searchParams, language) {
  const retreatSlug = searchParams.get("retreat") || "";
  return {
    bookingType: "retreat",
    retreatSlug,
    roomType: "not-sure",
    arrivalDate: "",
    departureDate: "",
    adults: "1",
    children: "0",
    guestLanguage: language || "en",
    preferredContact: "whatsapp",
    airportPickup: false,
    name: "",
    email: "",
    phone: "",
    country: "",
    dietaryNeeds: "",
    message: "",
    website: "",
  };
}

function bookingMessageUrl(record, channel) {
  const message = buildBookingMessage(record);
  if (channel === "email") {
    const subject = record.retreatTitle
      ? `Booking Request - ${record.retreatTitle}`
      : `Booking Request - ${record.id}`;
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${SITE.whatsAppPhone}?text=${encodeURIComponent(message)}`;
}

export default function Booking() {
  const { tx, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => initialFormFromParams(searchParams, language));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendMode = getBookingBackendMode();

  const selectedRetreat = retreats.find((retreat) => retreat.slug === form.retreatSlug);
  const preview = useMemo(
    () =>
      analyzeBookingDraft({
        ...form,
        retreatTitle: selectedRetreat?.title,
      }),
    [form, selectedRetreat]
  );

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setSubmitted(null);
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = tx("Your Name is required.");
    if (!form.email.trim()) {
      nextErrors.email = tx("Your Email is required.");
    } else if (!validEmail(form.email)) {
      nextErrors.email = tx("Please enter a valid email address.");
    }
    if (!form.phone.trim()) nextErrors.phone = tx("Phone Number is required.");
    if (!form.arrivalDate) nextErrors.arrivalDate = tx("Please choose an arrival date.");
    if (
      form.arrivalDate &&
      form.departureDate &&
      new Date(form.departureDate) < new Date(form.arrivalDate)
    ) {
      nextErrors.departureDate = tx("Departure must be after arrival.");
    }
    if (Number.parseInt(form.adults, 10) < 1) {
      nextErrors.adults = tx("At least one adult is required.");
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.website.trim()) {
      setStatus(tx("Request received. The team will review it shortly."));
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus(tx("Please fix the highlighted fields and try again."));
      return;
    }

    setIsSubmitting(true);
    setStatus(tx("Saving booking request..."));

    try {
      const record = await saveBookingRequestRemote({
        ...form,
        retreatTitle: selectedRetreat?.title,
        source: "website-booking-form",
      });
      setSubmitted(record);
      setStatus(
        record.storageMode === "supabase"
          ? tx("Booking request saved to Supabase. The team can now manage it from the dashboard.")
          : record.storageMode === "local-fallback"
            ? tx("Cloud sync is temporarily unavailable. Your request is prepared below. Please send it by WhatsApp or email so the team receives it.")
          : tx("Booking request saved locally. Add Supabase keys to sync it for the whole team.")
      );
    } catch (error) {
      setStatus(`${tx("Booking request could not be saved.")} ${error.message || ""}`.trim());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content">
      <SEO
        title={tx("Book Karibu Assalam | Retreats, Rooms, and Campus Visits")}
        description={tx(
          "Send a structured Karibu Assalam booking request for retreats, accommodation, campus visits, airport pickup, and guest support."
        )}
        image={bookingImg}
      />
      <Hero
        eyebrow={tx("Booking")}
        title={tx("Start a structured booking request")}
        subtitle={tx(
          "Share dates, guest details, room needs, and preferred contact method so the team can reply faster and avoid lost bookings."
        )}
        imageSrc={bookingImg}
        imageAlt="Assalam Ecolodge room and campus area"
        compact
      />

      <Section
        title={tx("Booking request")}
        subtitle={tx(
          backendMode === "supabase"
            ? "This automation layer saves each request in Supabase, triages it, drafts a reply, and prepares WhatsApp or email handoff."
            : "This automation layer is using local storage until Supabase environment keys are configured."
        )}
      >
        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="bookingType">{tx("Request type")}</label>
                <select id="bookingType" name="bookingType" value={form.bookingType} onChange={handleChange}>
                  {BOOKING_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {tx(option.label)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="retreatSlug">{tx("Retreat or camp")}</label>
                <select id="retreatSlug" name="retreatSlug" value={form.retreatSlug} onChange={handleChange}>
                  <option value="">{tx("Not sure yet")}</option>
                  {retreats.map((retreat) => (
                    <option key={retreat.slug} value={retreat.slug}>
                      {tx(retreat.title)}
                    </option>
                  ))}
                </select>
                {errors.retreatSlug && <p className="field-error">{errors.retreatSlug}</p>}
              </div>
            </div>

            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="arrivalDate">{tx("Arrival date")}</label>
                <input
                  id="arrivalDate"
                  name="arrivalDate"
                  type="date"
                  min={todayString()}
                  value={form.arrivalDate}
                  onChange={handleChange}
                />
                {errors.arrivalDate && <p className="field-error">{errors.arrivalDate}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="departureDate">{tx("Departure date")}</label>
                <input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  min={form.arrivalDate || todayString()}
                  value={form.departureDate}
                  onChange={handleChange}
                />
                {errors.departureDate && <p className="field-error">{errors.departureDate}</p>}
              </div>
            </div>

            <div className="form-grid three">
              <div className="form-field">
                <label htmlFor="adults">{tx("Adults")}</label>
                <input id="adults" name="adults" type="number" min="1" value={form.adults} onChange={handleChange} />
                {errors.adults && <p className="field-error">{errors.adults}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="children">{tx("Children")}</label>
                <input
                  id="children"
                  name="children"
                  type="number"
                  min="0"
                  value={form.children}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="roomType">{tx("Room preference")}</label>
                <select id="roomType" name="roomType" value={form.roomType} onChange={handleChange}>
                  {ROOM_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {tx(option.label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="guestLanguage">{tx("Preferred language")}</label>
                <select
                  id="guestLanguage"
                  name="guestLanguage"
                  value={form.guestLanguage}
                  onChange={handleChange}
                >
                  {GUEST_LANGUAGES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {tx(option.label)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="preferredContact">{tx("Preferred contact")}</label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={form.preferredContact}
                  onChange={handleChange}
                >
                  {CONTACT_METHODS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {tx(option.label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="name">{tx("Your Name")}</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="country">{tx("Country")}</label>
                <input id="country" name="country" value={form.country} onChange={handleChange} autoComplete="country-name" />
              </div>
            </div>

            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="email">{tx("Your Email")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">{tx("Phone Number")}</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
            </div>

            <div className="form-field checkbox-field">
              <input
                id="airportPickup"
                name="airportPickup"
                type="checkbox"
                checked={form.airportPickup}
                onChange={handleChange}
              />
              <label htmlFor="airportPickup">{tx("I may need airport pickup")}</label>
            </div>

            <div className="form-field">
              <label htmlFor="dietaryNeeds">{tx("Dietary or access needs")}</label>
              <input
                id="dietaryNeeds"
                name="dietaryNeeds"
                value={form.dietaryNeeds}
                onChange={handleChange}
                placeholder={tx("Halal meals, vegetarian meals, mobility needs, allergies...")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">{tx("Message")}</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder={tx("Tell us what you want to book, your flexibility, and any questions.")}
              />
            </div>

            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">{tx("Website")}</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
            </div>

            <div className="inline-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {tx(isSubmitting ? "Saving..." : "Save booking request")}
              </button>
              <CTAButton to="/contact" variant="secondary">
                {tx("Use direct contact instead")}
              </CTAButton>
            </div>

            {status && <p className="form-status" role="status">{status}</p>}
          </form>

          <aside className="automation-card" aria-label={tx("Automation preview")}>
            <p className="eyebrow">{tx("Automation preview")}</p>
            <h3>{tx("What the system prepares")}</h3>
            <dl className="automation-metrics">
              <div>
                <dt>{tx("Priority")}</dt>
                <dd>
                  <span className={`status-pill priority-${preview.priority}`}>{tx(preview.priority)}</span>
                </dd>
              </div>
              <div>
                <dt>{tx("Estimated rooms")}</dt>
                <dd>{preview.roomsNeeded}</dd>
              </div>
              <div>
                <dt>{tx("Trip nights")}</dt>
                <dd>{preview.nights ?? tx("Not set")}</dd>
              </div>
              <div>
                <dt>{tx("Timing")}</dt>
                <dd>{tx(preview.timing)}</dd>
              </div>
            </dl>
            <div className="automation-note">
              <strong>{tx("Next action")}</strong>
              <p>{tx(preview.nextAction)}</p>
            </div>
            <p className="small-note">{tx(PLANNING_CAPACITY.note)}</p>

            {submitted ? (
              <div className="receipt-card">
                <p className="eyebrow">{tx("Saved")}</p>
                <h3>{submitted.id}</h3>
                <p>{tx(submitted.automationSummary)}</p>
                <div className="inline-actions">
                  <a className="btn btn-primary btn-sm" href={bookingMessageUrl(submitted, "whatsapp")} target="_blank" rel="noopener noreferrer">
                    {tx("Send via WhatsApp")}
                  </a>
                  <a className="btn btn-secondary btn-sm" href={bookingMessageUrl(submitted, "email")}>
                    {tx("Send via Email")}
                  </a>
                </div>
                <Link className="text-link" to="/admin">
                  {tx("Open admin dashboard")}
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </main>
  );
}
