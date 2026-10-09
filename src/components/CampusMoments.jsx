import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import Lightbox from "./Lightbox";
import { SITE } from "../data/siteConfig";
import { campusMoments } from "../data/campusMoments";
import { schedulePhotoChange } from "../utils/photoRotation";
import { useLanguage } from "../context/LanguageContext";

export function MomentCard({ moment, order, playing, onOpen }) {
  const { tx } = useLanguage();
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState({ current: 0, previous: null });
  const photo = moment.photos[frame.current];
  const previous = moment.photos[frame.previous];

  useEffect(() => {
    // Without visibility observation, retain a manually browsable tile.
    if (!window.IntersectionObserver) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25);
    }, { threshold: [0, 0.25] });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || !ready || interacting || focused) return undefined;
    return schedulePhotoChange({
      photos: moment.photos,
      index: frame.current,
      delay: 7000 + order * 650,
      onReady: (next) => setFrame(current => ({ current: next, previous: current.current })),
    });
  }, [playing, inView, ready, interacting, focused, frame.current, moment.photos, order]);

  return (
    <button
      type="button"
      ref={cardRef}
      className={`moment-card ${moment.className || ""}`.trim()}
      aria-label={`${tx(moment.label)} — ${tx("View photo collection")}`}
      onPointerEnter={event => { if (event.pointerType === "mouse") setInteracting(true); }}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => onOpen(frame.current)}
    >
      {previous && <img className="moment-photo" src={previous.image} alt="" aria-hidden="true" />}
      <img
        key={photo.image}
        className={`moment-photo${previous ? " moment-photo-enter" : ""}`}
        src={photo.image}
        alt={tx(photo.alt)}
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
      <span className="moment-label">{tx(moment.label)}</span>
      <span className="moment-photo-count" aria-hidden="true">{frame.current + 1} / {moment.photos.length}</span>
      <span className="moment-zoom" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}

export default function CampusMoments() {
  const { tx } = useLanguage();
  const [lightbox, setLightbox] = useState(null);
  const [allowsMotion, setAllowsMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const updatePreferences = () => setAllowsMotion(!reducedMotion.matches && !connection?.saveData);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePreferences();
    updateVisibility();
    reducedMotion.addEventListener("change", updatePreferences);
    connection?.addEventListener?.("change", updatePreferences);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      reducedMotion.removeEventListener("change", updatePreferences);
      connection?.removeEventListener?.("change", updatePreferences);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const playing = allowsMotion && pageVisible && lightbox === null;
  const collection = lightbox === null ? null : campusMoments[lightbox.collection];

  return (
    <Section
      eyebrow="Gallery"
      title="Life at Karibu Assalam"
      subtitle="A glimpse of the spaces, shared meals, workshops and community experiences that shape a stay."
      className="moments-section"
    >
      <p className="moments-hint" id="moments-hint">{tx("Open any photo to explore its collection.")}</p>
      <div className="moments-grid" aria-describedby="moments-hint">
        {campusMoments.map((moment, i) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            order={i}
            playing={playing}
            onOpen={index => setLightbox({ collection: i, index })}
          />
        ))}
      </div>

      {collection && (
        <Lightbox
          items={collection.photos.map(photo => ({ ...photo, label: collection.label }))}
          index={lightbox.index}
          onChange={index => setLightbox(current => ({ ...current, index }))}
          onClose={() => setLightbox(null)}
        />
      )}
      <div className="moments-footer">
        <p>{tx("For current photos and announcements, follow the team on Instagram.")}</p>
        <a className="btn btn-secondary" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          {tx("Follow us on Instagram")}
        </a>
      </div>
    </Section>
  );
}
