import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TornEdge from "./TornEdge";
import { SITE } from "../data/siteConfig";
import aerialImg from "../../AssalamHero/assalam-hero.webp";
import purposeImg from "../../pics/aboutpic/Making a Difference in Zanzibar-enhanced.webp";
import experienceImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import retreatImg from "../../pics/our retreats/Nature Retreat-enhanced.webp";
import campusImg from "../../pics/rooms/Image-2-edited-enhanced.webp";

const INTERVAL = 8500;

const slides = [
  {
    id: "welcome",
    image: aerialImg,
    heading: "Welcome to Karibu Assalam Eco Resort",
    copy: "Discover our halal eco village on Zanzibar beach combining sustainable living, local culture, meaningful community experiences and peaceful retreats.",
    actions: [
      { ctaText: "Book Your Experience", to: "/contact", primary: true },
      { ctaText: "Explore Karibu Assalam", to: "/eco-resort" },
    ],
  },
  {
    id: "eco-village",
    image: campusImg,
    heading: "Eco-Village on the beach",
    copy: "Karibu Assalam is a community-based eco-village experience in Kizimkazi, Zanzibar, where visitors can stay, learn, relax and connect with local culture while supporting sustainable community development.",
    actions: [{ ctaText: "Find Your Stay", to: "/eco-resort", primary: true }],
  },
  {
    id: "experiences",
    image: experienceImg,
    heading: "Zanzibar Experiences",
    copy: "A different way to experience Zanzibar: explore the island and discover local culture on our trips and excursions, support meaningful projects in Kizimkazi, learn skills in a workshop or attend one of our cultural events.",
    actions: [{ ctaText: "Find Your Trip", to: "/experiences", primary: true }],
  },
  {
    id: "retreats",
    image: retreatImg,
    heading: "Retreats & Camps",
    copy: "Connect with local communities through Kindness Camp, family and Ramadan camps, and retreats inspired by Zanzibar's culture and nature.",
    actions: [{ ctaText: "Reserve your spot", to: "/contact", primary: true }],
  },
  {
    id: "purpose",
    image: purposeImg,
    heading: "Travel with a purpose",
    copy: "More than a stay: Since 2017, Assalam Community Foundation has worked with communities in Zanzibar across education, sustainability, art, community development and empowerment.",
    actions: [
      { ctaText: "Discover Assalam Foundation", href: SITE.foundationUrl, primary: true },
      { ctaText: "Join us", to: "/contact" },
    ],
  },
];

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path
        d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroAction({ action }) {
  const className = `btn ${action.primary ? "btn-primary" : "btn-outline"} btn-lg`;
  if (action.href) {
    return (
      <a className={className} href={action.href} target="_blank" rel="noopener noreferrer">
        {action.ctaText}
      </a>
    );
  }
  return <Link className={className} to={action.to}>{action.ctaText}</Link>;
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = slides[index];
  const go = useCallback((next) => setIndex(((next % slides.length) + slides.length) % slides.length), []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused]);

  function onKeyDown(event) {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  }

  return (
    <section
      className="hero-slider hero-slider-2026"
      aria-roledescription="carousel"
      aria-label="Karibu Assalam Eco Resort highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {slides.map((slide, slideIndex) => (
        <div
          className={`hero-slide ${slideIndex === index ? "is-active" : ""}`}
          key={slide.id}
          aria-hidden={slideIndex === index ? undefined : "true"}
        >
          <img
            src={slide.image}
            alt=""
            width="1920"
            height="1080"
            loading={slideIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={slideIndex === 0 ? "high" : "auto"}
          />
        </div>
      ))}

      <div className="hero-slider-scrim" aria-hidden="true" />

      <div className="container hero-slider-center hero-slider-center-2026" aria-live="polite">
        <p className="hero-kicker">Kizimkazi · Zanzibar</p>
        <h1 className="hero-script">{active.heading}</h1>
        {active.copy && <p className="hero-slide-copy">{active.copy}</p>}
        <div className="hero-slider-actions">
          {active.actions.map((action) => <HeroAction action={action} key={action.ctaText} />)}
        </div>
      </div>

      <div className="hero-controls" role="group" aria-label="Slideshow controls">
        <button type="button" className="hero-arrow prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
          <Arrow direction="prev" />
        </button>
        <div className="hero-dots" role="group" aria-label="Choose a slide">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-dot ${slideIndex === index ? "is-active" : ""}`}
              aria-pressed={slideIndex === index}
              aria-label={`Slide ${slideIndex + 1}: ${slide.heading}`}
              onClick={() => go(slideIndex)}
            />
          ))}
        </div>
        <button type="button" className="hero-arrow next" aria-label="Next slide" onClick={() => go(index + 1)}>
          <Arrow direction="next" />
        </button>
      </div>

      <TornEdge position="bottom" color="var(--bg)" />
    </section>
  );
}
