import { useMemo, useRef, useState } from "react";
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
} from "../data/bookingOptions";
import { buildBookingMessage, saveBookingRequestRemote } from "../utils/bookingAutomation";
import { useLanguage } from "../context/LanguageContext";
import bookingImg from "../../pics/rooms/camps-22-enhanced.webp";

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
  const [statusTone, setStatusTone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const selectedRetreat = retreats.find((retreat) => retreat.slug === form.retreatSlug);

  const nights = useMemo(() => {
    if (!form.arrivalDate || !form.departureDate) return null;
    const ms = new Date(form.departureDate) - new Date(form.arrivalDate);
    return ms > 0 ? Math.round(ms / 86400000) : null;
  }, [form.arrivalDate, form.departureDate]);

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
      setStatusTone("success");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus(tx("Please fix the highlighted fields and try again."));
      setStatusTone("error");
      // Send the visitor straight to the first problem instead of making them
      // hunt for red text.
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setIsSubmitting(true);
    setStatus(tx("Sending your request..."));
    setStatusTone("");

    try {
      const record = await saveBookingRequestRemote({
        ...form,
        retreatTitle: selectedRetreat?.title,
        source: "website-booking-form",
      });
      setSubmitted(record);
      if (record.storageMode === "supabase") {
        setStatus(
          tx("Thanks — we have your request. The team replies within one day, usually on WhatsApp.")
        );
        setStatusTone("success");
      } else {
        // Anything other than a confirmed remote save means the request is not
        // in the team's inbox. Say so and hand over a channel that works.
        setStatus(
          tx(
            "We could not send your request just now. Please send it by WhatsApp or email below and the team will pick it up right away."
          )
        );
        setStatusTone("error");
      }
    } catch {
      setStatus(
        tx(
          "We could not send your request just now. Please send it by WhatsApp or email below and the team will pick it up right away."
        )
      );
      setStatusTone("error");
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
          "Tell us your dates and who is travelling. The team confirms availability and next steps, usually within one day."
        )}
        imageSrc={bookingImg}
        imageAlt={tx("Room at Assalam Ecolodge prepared for guests")}
        compact
      />

      <Section
        title={tx("Booking request")}
        subtitle={tx(
          "Share your dates and group details and the team will confirm availability and the next steps."
        )}
      >
        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleSubmit} ref={formRef} noValidate>
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
                <select id="retreatSlug" name="retreatSlug" value={form.retreatSlug} onChange={handleChange}
                aria-invalid={errors.retreatSlug ? "true" : undefined}
                aria-describedby={errors.retreatSlug ? "retreatSlug-error" : undefined}
              >
                  <option value="">{tx("Not sure yet")}</option>
                  {retreats.map((retreat) => (
                    <option key={retreat.slug} value={retreat.slug}>
                      {tx(retreat.title)}
                    </option>
                  ))}
                </select>
                {errors.retreatSlug && <p className="field-error" id="retreatSlug-error">{errors.retreatSlug}</p>}
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
                aria-invalid={errors.arrivalDate ? "true" : undefined}
                aria-describedby={errors.arrivalDate ? "arrivalDate-error" : undefined}
              />
                {errors.arrivalDate && <p className="field-error" id="arrivalDate-error">{errors.arrivalDate}</p>}
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
                aria-invalid={errors.departureDate ? "true" : undefined}
                aria-describedby={errors.departureDate ? "departureDate-error" : undefined}
              />
                {errors.departureDate && <p className="field-error" id="departureDate-error">{errors.departureDate}</p>}
              </div>
            </div>

            <div className="form-grid three">
              <div className="form-field">
                <label htmlFor="adults">{tx("Adults")}</label>
                <input id="adults" name="adults" type="number" min="1" value={form.adults} onChange={handleChange}
                aria-invalid={errors.adults ? "true" : undefined}
                aria-describedby={errors.adults ? "adults-error" : undefined}
              />
                {errors.adults && <p className="field-error" id="adults-error">{errors.adults}</p>}
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
                <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name"
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
                {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
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
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
                {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">{tx("Phone Number")}</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel"
                aria-invalid={errors.phone ? "true" : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
                {errors.phone && <p className="field-error" id="phone-error">{errors.phone}</p>}
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

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? tx("Sending your request...") : tx("Send request")}
            </button>

            <p className="secondary-actions">
              <Link className="text-link" to="/contact">
                {tx("Use direct contact instead")}
              </Link>
            </p>

            {status && (
              <p
                className={"form-status " + (statusTone ? "is-" + statusTone : "")}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}
          </form>

          <aside className="booking-aside" aria-label={tx("What happens next")}>
            <div className="content-card">
              <h3>{tx("What happens next")}</h3>
              <ol className="next-steps">
                <li>{tx("The team checks availability for your dates.")}</li>
                <li>{tx("You get a reply with options, pricing, and what is included.")}</li>
                <li>
                  {tx("A 20% deposit confirms a camp booking. Individual stays can be paid on arrival.")}
                </li>
              </ol>
            </div>

            <div className="content-card">
              <h3>{tx("Your trip so far")}</h3>
              <dl className="trip-summary">
                <div>
                  <dt>{tx("Arrival")}</dt>
                  <dd>{form.arrivalDate || tx("Not set")}</dd>
                </div>
                <div>
                  <dt>{tx("Departure")}</dt>
                  <dd>{form.departureDate || tx("Not set")}</dd>
                </div>
                <div>
                  <dt>{tx("Trip nights")}</dt>
                  <dd>{nights ?? tx("Not set")}</dd>
                </div>
                <div>
                  <dt>{tx("Guests")}</dt>
                  <dd>
                    {(Number(form.adults) || 0) + (Number(form.children) || 0)} {tx("guest(s)")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="content-card">
              <h3>{tx("Questions in the meantime?")}</h3>
              <div className="aside-contact">
                <a
                  href={`https://wa.me/${SITE.whatsAppPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx("Message us on WhatsApp")}
                </a>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </div>
            </div>

            {submitted ? (
              <div className="receipt-card">
                <h3>{tx("Send it straight to the team")}</h3>
                <p>{tx("You can also forward this request yourself:")}</p>
                <div className="inline-actions">
                  <a
                    className="btn btn-primary btn-sm"
                    href={bookingMessageUrl(submitted, "whatsapp")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx("Send via WhatsApp")}
                  </a>
                  <a className="btn btn-secondary btn-sm" href={bookingMessageUrl(submitted, "email")}>
                    {tx("Send via Email")}
                  </a>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </main>
  );
}
