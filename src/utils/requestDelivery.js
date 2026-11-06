// Direct handoff works without a database or email service. Enable database
// submission explicitly only after the production Supabase project is ready.
export function usesDirectHandoff(mode = import.meta.env.VITE_BOOKING_DELIVERY) {
  return mode !== "database";
}
