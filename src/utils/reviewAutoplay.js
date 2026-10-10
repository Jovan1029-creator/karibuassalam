// Give short quotes at least eight seconds; longer translations get more time.
export function reviewReadingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.min(30000, Math.max(8000, 4000 + words * 300));
}

export function scheduleReviewAdvance({
  enabled, count, index, text, onAdvance,
  schedule = setTimeout, cancel = clearTimeout,
}) {
  if (!enabled || count < 2) return () => {};
  const timer = schedule(() => onAdvance((index + 1) % count), reviewReadingTime(text));
  return () => cancel(timer);
}
