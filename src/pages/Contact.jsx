import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import CTAButton from "../components/CTAButton";
import { SITE } from "../data/siteConfig";
import { getRetreatBySlug } from "../data/retreats";
import { buildMailtoUrl, buildWhatsAppUrl } from "../utils/contact";
import { useLanguage } from "../context/LanguageContext";
import contactImg from "../../pics/aboutpic/Traveling with Purpose.jpg";

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

  function handleOutbound(channel) {
    if (form.website.trim()) {
      setStatus(tx("Request received. Please use the visible contact channels if you need immediate support."));
      return;
    }

    const nextErrors = validate(form, tx);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus(tx("Please fix the highlighted fields and try again."));
      return;
    }

    const url = channel === "whatsapp" ? buildWhatsAppUrl(payload) : buildMailtoUrl(payload);
    setStatus(tx(channel === "whatsapp" ? "Opening WhatsApp..." : "Opening your email app..."));
    if (channel === "whatsapp") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
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
          "Send your request through WhatsApp or email using the form below. No backend is required for this version."
        )}
        imageSrc={contactImg}
        imageAlt="Traveling with purpose scene in Zanzibar"
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

          <form className="contact-form" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="form-field">
              <label htmlFor="name">{tx("Your Name")}</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
              {errors.name && <p className="field-error">{errors.name}</p>}
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
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="phone">{tx("Phone Number")}</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
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
              />
              {errors.message && <p className="field-error">{errors.message}</p>}
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

            <div className="inline-actions">
              <button type="button" className="btn btn-primary" onClick={() => handleOutbound("whatsapp")}>
                {tx("Send via WhatsApp")}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handleOutbound("email")}>
                {tx("Send via Email")}
              </button>
            </div>

            {status && <p className="form-status" role="status">{status}</p>}
          </form>
        </div>
      </Section>
    </main>
  );
}
