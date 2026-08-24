import { useLanguage } from "../context/LanguageContext";

/**
 * Renders a photograph, or a labelled placeholder where none has been supplied
 * yet. Dropping the real image in later is a one-line change at the call site —
 * pass `src` and the placeholder disappears.
 */
export default function PhotoSlot({
  src,
  alt,
  label,
  ratio = "5 / 4",
  className = "",
  width = 1024,
  height = 819,
  priority = false,
}) {
  const { tx } = useLanguage();

  if (src) {
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
      />
    );
  }

  return (
    <div
      className={`photo-slot ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={alt || tx("Photograph coming soon")}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m21 16-5-5L9 19" />
      </svg>
      <span>{label || tx("Photograph coming soon")}</span>
    </div>
  );
}
