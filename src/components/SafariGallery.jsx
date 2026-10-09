import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { safariGalleryPhotos } from "../data/safariPhotos";
import Lightbox from "./Lightbox";
import PhotoSlot from "./PhotoSlot";
import Section from "./Section";

export const safariLightboxPhotos = safariGalleryPhotos.map(({ src, alt, label }) => ({ image: src, alt, label }));

export default function SafariGallery() {
  const { tx } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section id="safari-gallery" title="Moments on safari" subtitle="A closer look at the wildlife and the journey." className="safari-gallery-section">
      <div className="safari-gallery">
        {safariGalleryPhotos.map((photo, index) => (
          <figure className="safari-gallery-item" key={photo.src}>
            <button
              type="button"
              className="safari-gallery-open"
              aria-label={`${tx(photo.label)} — ${tx("View photo")}`}
              aria-haspopup="dialog"
              onClick={() => setOpenIndex(index)}
            >
              <PhotoSlot {...photo} />
              <span className="safari-gallery-zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <figcaption>{tx(photo.label)}</figcaption>
          </figure>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          items={safariLightboxPhotos}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </Section>
  );
}
