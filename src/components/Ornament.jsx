/**
 * Small hand-drawn dhow on the water, used under a section heading the way the
 * reference uses its line-art sketches.
 */
export default function Ornament() {
  return (
    <svg
      className="ornament"
      viewBox="0 0 120 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* hull and sail */}
      <path d="M48 21h24l-3 4H51z" />
      <path d="M60 20V6" />
      <path d="M60 7c5 2 8 6 9 12H60z" />
      <path d="M60 9c-4 2-6 6-7 10h7" />
      {/* water */}
      <path d="M4 26c6-3 12-3 18 0s12 3 18 0" opacity="0.75" />
      <path d="M80 26c6-3 12-3 18 0s12 3 18 0" opacity="0.75" />
    </svg>
  );
}
