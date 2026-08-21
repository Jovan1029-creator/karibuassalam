/**
 * Soft organic edge between colour bands, in place of a hard rule.
 * `position` picks which side of the band it sits on; `color` is the colour of
 * the band the wave is cutting *into*.
 */
export default function Wave({ position = "bottom", color = "var(--bg)" }) {
  return (
    <svg
      className={`wave wave-${position}`}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={color}
        d="M0 28c120-18 240-27 360-16s240 41 360 44 240-20 360-33 240-13 360 3v34H0z"
      />
    </svg>
  );
}
