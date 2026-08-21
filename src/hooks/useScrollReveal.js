import { useEffect } from "react";

// Elements that get the reveal treatment. Tagging by selector keeps the markup
// clean — no wrapper components threaded through every page.
const TARGETS = [
  ".showcase",
  ".circle-card",
  ".retreat-card",
  ".section-header",
  ".set-intro",
  ".moment-card",
  ".amenity",
  ".testimonial-card",
  ".impact-feature",
];

/**
 * Fades content in as it enters the viewport. Runs once per element, skips
 * anything already on screen at load, and does nothing under reduced-motion.
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const elements = document.querySelectorAll(TARGETS.join(","));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach((el, i) => {
      // Anything already in view on load appears immediately — no flash.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.setAttribute("data-reveal", "");
        el.classList.add("is-visible");
        return;
      }
      el.setAttribute("data-reveal", String(i % 4));
      observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
