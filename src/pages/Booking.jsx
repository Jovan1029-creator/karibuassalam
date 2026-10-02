import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import BookingSummary from "../components/BookingSummary";
import BookingConfirmation from "../components/BookingConfirmation";
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
      : record.id ? `Booking Request - ${record.id}` : "Booking Request";
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${SITE.whatsAppPhone}?text=${encodeURIComponent(message)}`;
}

export default function Booking() {
  const { tx, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => initialFormFromParams(searchParams, language));
  // Keep source message keys in state so existing feedback follows language changes.
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [deliveryFailed, setDeliveryFailed] = useState(false);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const selectedRetreat = form.bookingType === "retreat" && retreats.find((retreat) => retreat.slug === form.retreatSlug);
  const directRequest = submitted || { ...form, retreatTitle: selectedRetreat?.title };

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setSubmitted(null);
    setDeliveryFailed(false);
    setStatus("");
    setStatusTone("");
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "bookingType" && value !== "retreat" ? { retreatSlug: "" } : {}),
    }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Your Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Your Email is required.";
    } else if (!validEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) nextErrors.phone = "Phone Number is required.";
    if (!form.arrivalDate) nextErrors.arrivalDate = "Please choose an arrival date.";
    if (
      form.arrivalDate &&
      form.departureDate &&
      new Date(form.departureDate) < new Date(form.arrivalDate)
    ) {
      nextErrors.departureDate = "Departure must be after arrival.";
    }
    if (Number.parseInt(form.adults, 10) < 1) {
      nextErrors.adults = "At least one adult is required.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setDeliveryFailed(false);
    setSubmitted(null);
    if (form.website.trim()) {
      setStatus("Request received. The team will review it shortly.");
      setStatusTone("success");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("Please fix the highlighted fields and try again.");
      setStatusTone("error");
      // Send the visitor straight to the first problem instead of making them
      // hunt for red text.
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending your request...");
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
          "Thanks — we have your request. Our team will contact you with more information."
        );
        setStatusTone("success");
      } else {
        // Anything other than a confirmed remote save means the request is not
        // in the team's inbox. Say so and hand over a channel that works.
        setStatus(
          "Your request has not been sent. Your details are still here. Use WhatsApp or email below to send them directly to the team."
        );
        setStatusTone("error");
        setDeliveryFailed(true);
      }
    } catch {
      setStatus(
        "Your request has not been sent. Your details are still here. Use WhatsApp or email below to send them directly to the team."
      );
      setStatusTone("error");
      setDeliveryFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content">
      <SEO
        title={tx("Book Karibu Assalam | Retreats, Rooms, and Campus Visits")}
        description={tx(
          "Send a Karibu Assalam booking request for retreats, accommodation, campus visits, airport pickup, and guest support."
        )}
        image={bookingImg}
      />
      <Hero
        eyebrow={tx("Booking")}
        title={tx("Interested?")}
        subtitle={tx(
          "Tell us which retreat, tour or workshop you are interested in, and our team will reach out to you with more information."
        )}
        imageSrc={bookingImg}
        imageAlt={tx("Room at Karibu Assalam Eco-Village prepared for guests")}
        compact
      />

      <Section
        title={tx("Submit your request")}
        subtitle={tx(
          "Share your dates and details, and the team will confirm availability and the next steps."
        )}
      >
        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className={`form-grid${form.bookingType === "retreat" ? " two" : ""}`}>
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

              {form.bookingType === "retreat" && <div className="form-field">
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
                {errors.retreatSlug && <p className="field-error" id="retreatSlug-error">{tx(errors.retreatSlug)}</p>}
              </div>}
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
                {errors.arrivalDate && <p className="field-error" id="arrivalDate-error">{tx(errors.arrivalDate)}</p>}
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
                {errors.departureDate && <p className="field-error" id="departureDate-error">{tx(errors.departureDate)}</p>}
              </div>
            </div>

            <div className="form-grid three">
              <div className="form-field">
                <label htmlFor="adults">{tx("Adults")}</label>
                <input id="adults" name="adults" type="number" min="1" value={form.adults} onChange={handleChange}
                aria-invalid={errors.adults ? "true" : undefined}
                aria-describedby={errors.adults ? "adults-error" : undefined}
              />
                {errors.adults && <p className="field-error" id="adults-error">{tx(errors.adults)}</p>}
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
                {errors.name && <p className="field-error" id="name-error">{tx(errors.name)}</p>}
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
                {errors.email && <p className="field-error" id="email-error">{tx(errors.email)}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">{tx("Phone Number")}</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel"
                aria-invalid={errors.phone ? "true" : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
                {errors.phone && <p className="field-error" id="phone-error">{tx(errors.phone)}</p>}
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
              {isSubmitting ? tx("Sending your request...") : deliveryFailed ? tx("Try again") : tx("Submit your request")}
            </button>

            <p className="secondary-actions">
              <Link className="text-link" to="/contact">
                {tx("Use direct contact instead")}
              </Link>
            </p>

            {status && (
              <p
                className={"form-status " + (statusTone ? "is-" + statusTone : "")}
                role={statusTone === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {tx(status)}
              </p>
            )}
            <BookingConfirmation record={submitted} />
            {deliveryFailed && (
              <div className="booking-handoff">
                <h3>{tx("Send it straight to the team")}</h3>
                <p>{tx("Your details are included. Review the message, then send it.")}</p>
                <div className="inline-actions">
                  <a
                    className="btn btn-primary btn-sm"
                    href={bookingMessageUrl(directRequest, "whatsapp")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx("Send via WhatsApp")}
                  </a>
                  <a className="btn btn-secondary btn-sm" href={bookingMessageUrl(directRequest, "email")}>
                    {tx("Send via Email")}
                  </a>
                </div>
              </div>
            )}
          </form>

          <aside className="booking-aside" aria-label={tx("Your trip so far")}>
            <BookingSummary form={form} />

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

          </aside>
        </div>
      </Section>
    </main>
  );
}
