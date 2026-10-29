import { useEffect, useId, useMemo, useState } from "react";
import CTAButton from "./CTAButton";
import { useLanguage } from "../context/LanguageContext";

// Every interior page shares a photo-first introduction. Keep the whole photograph.
export default function Hero({
  eyebrow, title, subtitle, standfirst, caption, imageSrc, imageAlt = "",
  slides = [], ctaPrimary, ctaSecondary, imagePosition = "50% 50%",
}) {
  const { tx } = useLanguage();
  const titleId = useId();
  const mediaSlides = useMemo(
    () => slides.length ? slides : imageSrc ? [{ src: imageSrc, alt: imageAlt }] : [],
    [imageAlt, imageSrc, slides]
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(false);

  useEffect(() => { setActiveSlide(0); }, [imageSrc, mediaSlides.length]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowsMotion(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (mediaSlides.length < 2 || paused || interacting || !allowsMotion) return undefined;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveSlide(current => (current + 1) % mediaSlides.length);
      }
    }, 6500);
    return () => window.clearInterval(timer);
  }, [mediaSlides.length, paused, interacting, allowsMotion]);

  return (
    <section className={`hero editorial-hero${mediaSlides.length ? "" : " is-text-only"}`} aria-labelledby={titleId}>
      <div className="container editorial-grid">
        {mediaSlides.length > 0 && <figure className="editorial-photo"
          onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
          <div className="editorial-images">
            {mediaSlides.map((slide, index) => (
              <img key={slide.src} className={`editorial-image${index === activeSlide ? " is-active" : ""}`}
                src={slide.src} alt={index === activeSlide ? tx(slide.alt || imageAlt) : ""}
                aria-hidden={index === activeSlide ? undefined : "true"}
                loading={index === 0 ? "eager" : "lazy"} decoding="async"
                fetchpriority={index === 0 ? "high" : "auto"}
                style={{ objectPosition: slide.objectPosition || imagePosition }} />
            ))}
          </div>
          {caption && <figcaption>{tx(caption)}</figcaption>}
          {mediaSlides.length > 1 && <div className="editorial-photo-controls">
            <button type="button" className="editorial-playback"
              aria-label={tx(paused ? "Play image carousel" : "Pause image carousel")}
              onClick={() => setPaused(current => !current)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paused ? "m8 5 11 7-11 7V5Z" : "M7 5h3v14H7zM14 5h3v14h-3z"} /></svg>
            </button>
            <div className="editorial-photo-dots" aria-label={tx("Choose hero image")}>
              {mediaSlides.map((slide, index) => (
                <button type="button" key={slide.src} className={index === activeSlide ? "is-active" : ""}
                  aria-label={tx("Show image {number}: {label}", { number: index + 1, label: tx(slide.label || slide.alt) })}
                  aria-current={index === activeSlide ? "true" : undefined} onClick={() => setActiveSlide(index)} />
              ))}
            </div>
            <span>{tx(mediaSlides[activeSlide]?.label)}</span>
          </div>}
        </figure>}
        <div className="editorial-copy">
          {eyebrow && <p className="eyebrow">{tx(eyebrow)}</p>}
          <h1 id={titleId}>{tx(title)}</h1>
          {standfirst && <p className="editorial-lead">{tx(standfirst)}</p>}
          {subtitle && <p className="editorial-description">{tx(subtitle)}</p>}
          {(ctaPrimary || ctaSecondary) && <div className="inline-actions editorial-actions">
            {ctaPrimary && <CTAButton {...ctaPrimary}>{ctaPrimary.label}</CTAButton>}
            {ctaSecondary && <CTAButton {...ctaSecondary}>{ctaSecondary.label}</CTAButton>}
          </div>}
        </div>
      </div>
    </section>
  );
}
