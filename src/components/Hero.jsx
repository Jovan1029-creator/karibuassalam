import { useEffect, useMemo, useState } from "react";
import CTAButton from "./CTAButton";

function CarouselIcon({ paused }) {
  if (paused) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 5 11 7-11 7V5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </svg>
  );
}

export default function Hero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  slides = [],
  ctaPrimary,
  ctaSecondary,
  align = "left",
  compact = false,
}) {
  const mediaSlides = useMemo(
    () => (slides.length ? slides : imageSrc ? [{ src: imageSrc, alt: imageAlt }] : []),
    [imageAlt, imageSrc, slides]
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActiveSlide(0);
  }, [mediaSlides.length]);

  useEffect(() => {
    if (mediaSlides.length < 2 || paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % mediaSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [mediaSlides.length, paused]);

  return (
    <section className={`hero ${compact ? "compact" : ""} ${mediaSlides.length > 1 ? "has-carousel" : ""} align-${align}`}>
      {mediaSlides.length ? (
        <div className="hero-media">
          {mediaSlides.map((slide, index) => (
            <img
              key={slide.src}
              className={`hero-slide ${index === activeSlide ? "is-active" : ""}`}
              src={slide.src}
              alt={index === activeSlide ? slide.alt || imageAlt : ""}
              aria-hidden={index === activeSlide ? undefined : "true"}
              loading={index === 0 && !compact ? "eager" : "lazy"}
              decoding="async"
              width="1600"
              height="900"
              fetchpriority={index === 0 && !compact ? "high" : "auto"}
            />
          ))}
          <div className="hero-overlay" />
        </div>
      ) : null}
      <div className="container hero-content">
        <div className="hero-panel">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {subtitle && <p className="lead">{subtitle}</p>}
          {(ctaPrimary || ctaSecondary) && (
            <div className="inline-actions">
              {ctaPrimary && <CTAButton {...ctaPrimary}>{ctaPrimary.label}</CTAButton>}
              {ctaSecondary && <CTAButton {...ctaSecondary}>{ctaSecondary.label}</CTAButton>}
            </div>
          )}
        </div>
      </div>
      {mediaSlides.length > 1 ? (
        <div className="container hero-carousel-shell">
          <div className="hero-carousel-controls">
            <button
              type="button"
              className="hero-carousel-toggle"
              aria-label={paused ? "Play image carousel" : "Pause image carousel"}
              title={paused ? "Play image carousel" : "Pause image carousel"}
              onClick={() => setPaused((current) => !current)}
            >
              <CarouselIcon paused={paused} />
            </button>
            <div className="hero-carousel-dots" aria-label="Choose hero image">
              {mediaSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.src}
                  className={`hero-carousel-dot ${index === activeSlide ? "is-active" : ""}`}
                  aria-label={`Show image ${index + 1}: ${slide.label || slide.alt}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <span className="hero-carousel-label">{mediaSlides[activeSlide]?.label}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
