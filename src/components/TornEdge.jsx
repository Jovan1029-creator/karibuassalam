/**
 * Torn-paper edge between colour bands — the reference uses this instead of a
 * hard horizontal rule. `color` is the colour of the band being torn *into*.
 */
export default function TornEdge({ position = "bottom", color = "var(--bg)", className = "" }) {
  return (
    <svg
      className={`torn torn-${position} ${className}`.trim()}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* One broad sweep across the full 1440 viewBox — 540 + 540 + 360. */}
      <path
        fill={color}
        d="M0 16c180 32 372 6 540 12s360 30 540 6 300-24 360-16v46H0z"
      />
    </svg>
  );
}
