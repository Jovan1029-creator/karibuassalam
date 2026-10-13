import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { facilities } from "../data/facilities";
import Section from "./Section";

// A small, consistent set of line illustrations drawn for the campus.
// Visible link labels provide the accessible name; the artwork is decorative.
const illustrations = {
  dining: <>
    <path d="M13 38a19 19 0 0 1 38 0M10 38h44M14 44h36M19 49h26M32 16v-4M29 12h6" />
    <path d="M8 18v8m-3-8v5a3 3 0 0 0 6 0v-5M8 26v15M57 18v23m0-23c-5 2-5 11 0 11" />
  </>,
  jetty: <>
    <path d="m12 27 17-15 17 15H12Zm5 0v16m24-16v16M22 22l7-10 7 10M24 28v10h10V28M29 38l-8 16m13-16 12 16M26 44h13m-16 6h20" />
    <path d="M5 43q4 4 8 0m34 0q4 4 8 0M6 52q4 4 8 0m36 0q4 4 8 0" />
  </>,
  room: <>
    <path d="M11 48V24q0-3 3-3h36q3 0 3 3v24M11 35h42v11H11m3 0v6m36-6v6" />
    <rect x="17" y="27" width="12" height="8" rx="3" />
    <rect x="35" y="27" width="12" height="8" rx="3" />
    <path d="M25 8h14v8H25zM32 8v8" />
  </>,
  wifi: <>
    <path d="M7 23a37 37 0 0 1 50 0M14 31a26 26 0 0 1 36 0M22 39a15 15 0 0 1 20 0" />
    <circle cx="32" cy="48" r="3" />
  </>,
  spa: <>
    <path d="M8 46q6 5 12 0t12 0 12 0 12 0M8 54q6 5 12 0t12 0 12 0 12 0M39 40V21a5 5 0 0 1 10 0v3M49 40V30M39 30h10m-10 7h10" />
    <path d="M23 38c-8-1-12-7-11-15 8 0 14 5 14 11m-3 4c-3-11 0-20 8-25 5 11 2 19-8 25Z" />
  </>,
  mosque: <>
    <path d="M17 49V29h30v20M21 29c0-9 11-12 11-18 0 6 11 9 11 18M28 49V39a4 4 0 0 1 8 0v10M7 49V23h5v26m-7 0h54M5 23l4.5-8 4.5 8M53 49V23h5v26m-7-26 4.5-8 4.5 8" />
    <path d="M35 6a4 4 0 0 1-5-5 4 4 0 1 0 5 5" />
  </>,
  garden: <>
    <path d="M32 47V22M32 33C18 34 12 26 13 17c12 0 20 6 19 16Zm0-10c-1-10 6-16 18-16 1 10-6 17-18 16ZM10 48q9-6 22 0t22 0M10 55q9-6 22 0t22 0" />
    <path d="m20 24 12 9m0-10 11-9" />
  </>,
  boutique: <>
    <path d="M23 23v-6a9 9 0 0 1 18 0v6M15 23h34l4 30H11l4-30Z" />
    <path d="m32 30 9 8-9 8-9-8 9-8Zm-15 1 3 3m24-3 3 3m-30 12 3 3m24-3 3 3" />
  </>,
  arts: <>
    <ellipse cx="26" cy="25" rx="13" ry="5" />
    <path d="m13 25 4 24c6 4 12 4 18 0l4-24M16 43h20M19 29l5 14 5-14 5 14M45 24V11l10-3v13m-10-6 10-3" />
    <ellipse cx="42" cy="25" rx="3" ry="2" />
    <ellipse cx="52" cy="22" rx="3" ry="2" />
  </>,
  workshops: <>
    <path d="m15 38 13-7 16 8-13 8-16-9Zm0 0v9l16 8 13-8v-8M31 47v8M32 18l5 5M26 27l17-17 6 6-17 17-8 2 2-8Z" />
    <path d="M15 12v8m-4-4h8M52 32v6m-3-3h6" />
  </>,
};

export default function Facilities() {
  const { tx } = useLanguage();

  return (
    <Section id="facilities" eyebrow="At the eco-village" title="Facilities" className="facilities-section">
      <ul className="facilities-grid">
        {facilities.map(facility => (
          <li key={facility.icon}>
            <Link className="facility-link" to={facility.to}>
              <span className="facility-icon-frame" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true">
                  {illustrations[facility.icon]}
                </svg>
              </span>
              <span className="facility-label">{tx(facility.label)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="facilities-more">
        <Link className="text-link" to="/campus#campus-spaces">{tx("Explore our campus")}<span aria-hidden="true"> ↗</span></Link>
      </div>
    </Section>
  );
}
