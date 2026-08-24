import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * Full-screen viewer for the photo mosaic. Opens on the picture that was
 * clicked, moves with the arrow keys, closes on Escape or a click outside.
 */
export default function Lightbox({ items, index, onClose, onChange }) {
  const { tx } = useLanguage();
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  const count = items.length;
  const go = useCallback(
    (next) => onChange(((next % count) + count) % count),
    [count, onChange]
  );

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      // Send focus back where it came from.
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "Tab") {
        // Only the controls are focusable, so keep Tab inside the dialog.
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, index, onClose]);

  const item = items[index];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={tx(item.label)}
      onClick={onClose}
    >
      <button type="button" className="lightbox-close" ref={closeRef} onClick={onClose}>
        <span className="visually-hidden">{tx("Close")}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {count > 1 && (
        <button
          type="button"
          className="lightbox-arrow prev"
          aria-label={tx("Previous slide")}
          onClick={(event) => {
            event.stopPropagation();
            go(index - 1);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Clicks on the figure itself must not close the dialog. */}
      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img src={item.image} alt={tx(item.alt)} />
        <figcaption>
          {tx(item.label)}
          <span className="lightbox-count">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>

      {count > 1 && (
        <button
          type="button"
          className="lightbox-arrow next"
          aria-label={tx("Next slide")}
          onClick={(event) => {
            event.stopPropagation();
            go(index + 1);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
