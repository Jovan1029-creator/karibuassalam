import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import CTAButton from "../components/CTAButton";
import { SITE } from "../data/siteConfig";
import { getRetreatBySlug } from "../data/retreats";
import { buildMailtoUrl, buildWhatsAppUrl } from "../utils/contact";
import { useLanguage } from "../context/LanguageContext";
import contactImg from "../../AssalamHero/hero-poster.webp";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

function validate(form, tx) {
  const errors = {};
  if (!form.name.trim()) errors.name = tx("Your Name is required.");
  if (!form.email.trim()) {
    errors.email = tx("Your Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = tx("Please enter a valid email address.");
  }
  if (!form.phone.trim()) errors.phone = tx("Phone Number is required.");
  if (!form.message.trim()) errors.message = tx("Message is required.");
  return errors;
}

function ContactIcon({ type }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 3a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 5.9 5.9l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .7 3 .8A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (type === "form") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3h6l1 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l1-2Z" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DirectContactItem({ icon, label, children }) {
  return (
    <li className="direct-contact-item">
      <span className="direct-contact-icon" aria-hidden="true">
        <ContactIcon type={icon} />
      </span>
      <span className="direct-contact-copy">
        <span className="direct-contact-label">{label}</span>
        <span className="direct-contact-value">{children}</span>
      </span>
    </li>
  );
}

export default function Contact() {
  const { tx, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusTone, setStatusTone] = useState("");
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef(null);

  const intent = searchParams.get("intent") || "contact";
  const retreatSlug = searchParams.get("retreat") || "";
  const retreat = getRetreatBySlug(retreatSlug);

  const selectedRetreatLabel = retreat?.title || "";

  const payload = useMemo(
    () => ({
      intent,
      retreatTitle: selectedRetreatLabel || undefined,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      language,
    }),
    [intent, selectedRetreatLabel, form, language]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.website.trim()) {
      setStatus(tx("Request received. Please use the visible contact channels if you need immediate support."));
      setStatusTone("success");
      return;
    }

    const nextErrors = validate(form, tx);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus(tx("Please fix the highlighted fields and try again."));
      setStatusTone("error");
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setIsSending(true);
    setStatus(tx("Sending..."));
    setStatusTone("");

    try {
      // Contact enquiries go to the same place as bookings, so nothing is lost
      // to an unconfigured mail client. Loaded on demand to keep the database
      // client out of the main bundle.
      const { saveBookingRequestRemote } = await import("../utils/bookingAutomation");
      const record = await saveBookingRequestRemote({
        bookingType: "enquiry",
        retreatSlug,
        retreatTitle: selectedRetreatLabel || undefined,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        guestLanguage: language,
        preferredContact: "email",
        source: "website-contact-form",
      });

      if (record.storageMode === "supabase") {
        setStatus(tx("Thanks — we have your message. The team usually replies within one day."));
        setStatusTone("success");
        setForm(initialForm);
      } else {
        setStatus(
          tx(
            "We could not send your message just now. Please use WhatsApp or email below and we will get straight back to you."
          )
        );
        setStatusTone("error");
      }
    } catch {
      setStatus(
        tx(
          "We could not send your message just now. Please use WhatsApp or email below and we will get straight back to you."
        )
      );
      setStatusTone("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main id="main-content">
      <SEO
        title={tx("Contact & Booking | Karibu Assalam")}
        description={tx(
          "Contact Karibu Assalam to ask questions, request a campus visit, or send a booking request via WhatsApp or email."
        )}
        image={contactImg}
      />
      <Hero
        eyebrow={tx("Contact")}
        title={tx("Contact and booking support")}
        subtitle={tx(
          "Tell us what you are planning and the team will reply, usually within one day."
        )}
        imageSrc={contactImg}
        imageAlt={tx("Aerial view of Assalam Ecolodge on the Zanzibar coast")}
        compact
      />

      <Section
        title={tx("Contact Karibu Assalam")}
        subtitle={tx(
          "Share your travel plans and the team can guide you on booking, camp details, or campus visit requests."
        )}
      >
        <div className="contact-layout">
          <div className="contact-stack">
            <div className="content-card contact-card">
              <h3>{tx("Direct contact")}</h3>
              <ul className="direct-contact-list">
                <DirectContactItem icon="phone" label={tx("Phone")}>
                  <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
                </DirectContactItem>

                <DirectContactItem icon="email" label={tx("Email")}>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </DirectContactItem>

                <DirectContactItem icon="instagram" label={tx("Follow Us")}>
                  <a
                    href={SITE.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Karibu Assalam on Instagram"
                  >
                    Instagram ({SITE.instagramHandle})
                  </a>
                </DirectContactItem>
              </ul>
              {selectedRetreatLabel ? (
                <p className="callout">
                  {tx("Booking intent detected for")} <strong>{tx(selectedRetreatLabel)}</strong>.
                </p>
              ) : null}
              <div className="inline-actions contact-card-actions">
                <CTAButton to="/booking" variant="secondary" size="sm" className="contact-booking-link">
                  <span className="btn-icon" aria-hidden="true">
                    <ContactIcon type="form" />
                  </span>
                  <span>{tx("Open structured booking form")}</span>
                </CTAButton>
              </div>
            </div>

            <div className="content-card map-card">
              <h3>Assalam Community Foundation</h3>
              <div className="map-frame">
                <iframe
                  title="Assalam Community Foundation location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.576621766117!2d39.46254778063581!3d-6.448364657866362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185d05fc3956b703%3A0x27f750fc3ab0e896!2sAssalam%20Community%20Foundation!5e0!3m2!1sen!2stz!4v1771861462061!5m2!1sen!2stz"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className="form-field">
              <label htmlFor="name">{tx("Your Name")}</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name"
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
            </div>

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
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                aria-invalid={errors.phone ? "true" : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && <p className="field-error" id="phone-error">{errors.phone}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="message">{tx("Message")}</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder={
                  selectedRetreatLabel
                    ? `${tx("I am interested in")} ${tx(selectedRetreatLabel)}.`
                    : tx("Tell us about your travel plans or question.")
                }
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
            </div>

            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">{tx("Website")}</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSending}>
              {isSending ? tx("Sending...") : tx("Send message")}
            </button>

            {status && (
              <p
                className={"form-status " + (statusTone ? "is-" + statusTone : "")}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}

            <div className="secondary-actions">
              <span>{tx("Prefer to write directly?")}</span>
              <a
                className="text-link"
                href={buildWhatsAppUrl(payload)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tx("Send via WhatsApp")}
              </a>
              <a className="text-link" href={buildMailtoUrl(payload)}>
                {tx("Send via Email")}
              </a>
            </div>
          </form>
        </div>
      </Section>
    </main>
  );
}
