import { BOOKING_STATUSES, PLANNING_CAPACITY } from "../data/bookingOptions";
import { getRetreatBySlug } from "../data/retreats";
import { getBackendMode, isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "karibuassalam-booking-requests-v1";
const TABLE_NAME = "booking_requests";

function clean(value) {
  return String(value ?? "").trim();
}

function toNumber(value, fallback = 0) {
  const next = Number.parseInt(value, 10);
  return Number.isFinite(next) ? next : fallback;
}

function dateValue(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(start, end) {
  const startDate = dateValue(start);
  const endDate = dateValue(end);
  if (!startDate || !endDate) return null;
  return Math.max(0, Math.round((endDate - startDate) / 86400000));
}

function daysUntil(value) {
  const target = dateValue(value);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function statusLabel(status) {
  return BOOKING_STATUSES.find((item) => item.value === status)?.label ?? status;
}

function buildId(createdAt = new Date()) {
  const stamp = createdAt.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KA-${stamp}-${random}`;
}

export function normalizeBookingDraft(data = {}) {
  const retreat = getRetreatBySlug(data.retreatSlug);
  const adults = Math.max(1, toNumber(data.adults, 1));
  const children = Math.max(0, toNumber(data.children, 0));
  const guests = adults + children;

  return {
    bookingType: clean(data.bookingType) || "retreat",
    retreatSlug: clean(data.retreatSlug),
    retreatTitle: clean(data.retreatTitle) || retreat?.title || "",
    roomType: clean(data.roomType) || "not-sure",
    arrivalDate: clean(data.arrivalDate),
    departureDate: clean(data.departureDate),
    adults,
    children,
    guests,
    guestLanguage: clean(data.guestLanguage) || clean(data.language) || "en",
    preferredContact: clean(data.preferredContact) || "whatsapp",
    airportPickup: Boolean(data.airportPickup),
    name: clean(data.name),
    email: clean(data.email),
    phone: clean(data.phone),
    country: clean(data.country),
    dietaryNeeds: clean(data.dietaryNeeds),
    message: clean(data.message),
    source: clean(data.source) || "website",
  };
}

export function analyzeBookingDraft(data = {}) {
  const booking = normalizeBookingDraft(data);
  const nights = daysBetween(booking.arrivalDate, booking.departureDate);
  const arrivalInDays = daysUntil(booking.arrivalDate);
  const roomsNeeded = Math.max(1, Math.ceil(booking.guests / PLANNING_CAPACITY.roomCapacityGuests));

  let score = 20;
  if (booking.retreatTitle || booking.bookingType === "accommodation") score += 15;
  if (booking.arrivalDate) score += 15;
  if (booking.departureDate || booking.bookingType !== "accommodation") score += 10;
  if (booking.email) score += 10;
  if (booking.phone) score += 10;
  if (booking.guests >= 2) score += 10;
  if (booking.airportPickup) score += 5;
  if (arrivalInDays !== null && arrivalInDays >= 0 && arrivalInDays <= 21) score += 15;

  const priority = score >= 80 ? "high" : score >= 55 ? "medium" : "normal";
  const timing =
    arrivalInDays === null
      ? "Dates not complete"
      : arrivalInDays < 0
        ? "Past arrival date"
        : arrivalInDays <= 7
          ? "Urgent arrival window"
          : arrivalInDays <= 21
            ? "Near-term arrival"
            : "Standard planning window";

  const summaryParts = [
    booking.name ? `${booking.name}` : "Guest",
    booking.bookingType === "retreat" && booking.retreatTitle
      ? `asked about ${booking.retreatTitle}`
      : `sent a ${booking.bookingType.replace("-", " ")} request`,
    booking.guests ? `for ${booking.guests} guest${booking.guests === 1 ? "" : "s"}` : null,
    booking.arrivalDate ? `arriving ${booking.arrivalDate}` : null,
    booking.guestLanguage ? `language: ${booking.guestLanguage.toUpperCase()}` : null,
  ].filter(Boolean);

  const nextAction =
    priority === "high"
      ? "Reply today, confirm availability, and ask for deposit steps if dates are possible."
      : booking.arrivalDate
        ? "Confirm availability, clarify room setup, and send the relevant retreat or accommodation details."
        : "Ask for preferred dates, group size, and whether they need accommodation or a camp package.";

  return {
    priority,
    score,
    timing,
    nights,
    roomsNeeded,
    summary: `${summaryParts.join(" ")}.`,
    nextAction,
  };
}

export function buildBookingMessage(data = {}) {
  const booking = normalizeBookingDraft(data);
  const analysis = analyzeBookingDraft(booking);

  return [
    "Hello Karibu Assalam,",
    "",
    "I would like to make a booking request.",
    booking.retreatTitle ? `Retreat/camp: ${booking.retreatTitle}` : null,
    `Request type: ${booking.bookingType}`,
    booking.arrivalDate ? `Arrival date: ${booking.arrivalDate}` : null,
    booking.departureDate ? `Departure date: ${booking.departureDate}` : null,
    `Guests: ${booking.adults} adult${booking.adults === 1 ? "" : "s"}, ${booking.children} child${booking.children === 1 ? "" : "ren"}`,
    `Estimated rooms needed: ${analysis.roomsNeeded}`,
    `Preferred language: ${booking.guestLanguage.toUpperCase()}`,
    `Preferred contact: ${booking.preferredContact}`,
    booking.airportPickup ? "Airport pickup: Yes" : "Airport pickup: Not requested yet",
    booking.country ? `Country: ${booking.country}` : null,
    booking.dietaryNeeds ? `Dietary/access needs: ${booking.dietaryNeeds}` : null,
    "",
    "Guest details:",
    booking.name ? `Name: ${booking.name}` : null,
    booking.email ? `Email: ${booking.email}` : null,
    booking.phone ? `Phone/WhatsApp: ${booking.phone}` : null,
    "",
    "Message:",
    booking.message || "Please share availability, price, and next steps.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildReplyDraft(data = {}) {
  const booking = normalizeBookingDraft(data);
  const analysis = analyzeBookingDraft(booking);
  const greeting = booking.name ? `Hello ${booking.name},` : "Hello,";
  const program = booking.retreatTitle || "your Karibu Assalam request";
  const dates =
    booking.arrivalDate && booking.departureDate
      ? ` for ${booking.arrivalDate} to ${booking.departureDate}`
      : booking.arrivalDate
        ? ` from ${booking.arrivalDate}`
        : "";

  return [
    greeting,
    "",
    `Thank you for contacting Karibu Assalam about ${program}${dates}. We received your request for ${booking.guests} guest${booking.guests === 1 ? "" : "s"}.`,
    "Our team will check availability and reply with the best room or camp option, included services, and next steps.",
    booking.airportPickup
      ? "We also noted that airport pickup may be needed."
      : "If you need airport pickup, please tell us your arrival airport and flight time.",
    "",
    "To help us confirm faster, please share any fixed travel dates, room preferences, dietary needs, and whether you are booking as an individual, family, school, or group.",
    "",
    `Internal note: ${analysis.nextAction}`,
  ].join("\n");
}

export function createBookingRecord(data = {}) {
  const createdAt = new Date();
  const draft = normalizeBookingDraft(data);
  const analysis = analyzeBookingDraft(draft);

  return {
    id: clean(data.id) || buildId(createdAt),
    createdAt: data.createdAt || createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    status: clean(data.status) || "new",
    ...draft,
    priority: analysis.priority,
    score: analysis.score,
    timing: analysis.timing,
    nights: analysis.nights,
    roomsNeeded: analysis.roomsNeeded,
    automationSummary: analysis.summary,
    nextAction: analysis.nextAction,
    replyDraft: buildReplyDraft(draft),
  };
}

function toDbRow(record) {
  return {
    id: record.id,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    status: record.status,
    booking_type: record.bookingType,
    retreat_slug: record.retreatSlug || null,
    retreat_title: record.retreatTitle || null,
    room_type: record.roomType,
    arrival_date: record.arrivalDate || null,
    departure_date: record.departureDate || null,
    adults: record.adults,
    children: record.children,
    guests: record.guests,
    guest_language: record.guestLanguage,
    preferred_contact: record.preferredContact,
    airport_pickup: record.airportPickup,
    name: record.name,
    email: record.email,
    phone: record.phone,
    country: record.country || null,
    dietary_needs: record.dietaryNeeds || null,
    message: record.message || null,
    source: record.source,
    priority: record.priority,
    score: record.score,
    timing: record.timing,
    nights: record.nights,
    rooms_needed: record.roomsNeeded,
    automation_summary: record.automationSummary,
    next_action: record.nextAction,
    reply_draft: record.replyDraft,
  };
}

function fromDbRow(row = {}) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    bookingType: row.booking_type,
    retreatSlug: row.retreat_slug || "",
    retreatTitle: row.retreat_title || "",
    roomType: row.room_type,
    arrivalDate: row.arrival_date || "",
    departureDate: row.departure_date || "",
    adults: row.adults,
    children: row.children,
    guests: row.guests,
    guestLanguage: row.guest_language,
    preferredContact: row.preferred_contact,
    airportPickup: Boolean(row.airport_pickup),
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country || "",
    dietaryNeeds: row.dietary_needs || "",
    message: row.message || "",
    source: row.source,
    priority: row.priority,
    score: row.score,
    timing: row.timing,
    nights: row.nights,
    roomsNeeded: row.rooms_needed,
    automationSummary: row.automation_summary,
    nextAction: row.next_action,
    replyDraft: row.reply_draft,
  };
}

export function readBookingRequests() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const records = raw ? JSON.parse(raw) : [];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function writeBookingRequests(records) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveBookingRequest(data = {}) {
  const record = createBookingRecord(data);
  const records = readBookingRequests();
  writeBookingRequests([record, ...records]);
  return record;
}

export async function saveBookingRequestRemote(data = {}) {
  const record = createBookingRecord(data);

  if (!isSupabaseConfigured) {
    const records = readBookingRequests();
    writeBookingRequests([record, ...records]);
    return record;
  }

  const { data: savedRow, error } = await supabase
    .from(TABLE_NAME)
    .insert(toDbRow(record))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDbRow(savedRow);
}

export async function loadBookingRequests() {
  if (!isSupabaseConfigured) {
    return readBookingRequests();
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(fromDbRow);
}

export function updateBookingStatus(id, status) {
  const records = readBookingRequests();
  const next = records.map((record) =>
    record.id === id
      ? {
          ...record,
          status,
          updatedAt: new Date().toISOString(),
        }
      : record
  );
  writeBookingRequests(next);
  return next;
}

export async function updateBookingStatusRemote(id, status) {
  if (!isSupabaseConfigured) {
    return updateBookingStatus(id, status);
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*");

  if (error) {
    throw error;
  }

  const changed = (data || []).map(fromDbRow);
  const records = await loadBookingRequests();
  return records.map((record) => changed.find((item) => item.id === record.id) || record);
}

export function deleteBookingRequest(id) {
  const next = readBookingRequests().filter((record) => record.id !== id);
  writeBookingRequests(next);
  return next;
}

export async function deleteBookingRequestRemote(id) {
  if (!isSupabaseConfigured) {
    return deleteBookingRequest(id);
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    throw error;
  }

  return loadBookingRequests();
}

export function createSampleBooking() {
  return saveBookingRequest({
    bookingType: "retreat",
    retreatSlug: "kindness-camp",
    arrivalDate: "2026-07-12",
    departureDate: "2026-07-19",
    adults: 2,
    children: 0,
    guestLanguage: "en",
    preferredContact: "whatsapp",
    airportPickup: true,
    name: "Sample Guest",
    email: "guest@example.com",
    phone: "+255 700 000 000",
    country: "Germany",
    dietaryNeeds: "Halal meals and one vegetarian option",
    message: "We are interested in a service-focused retreat and would like availability and deposit details.",
  });
}

export async function createSampleBookingRemote() {
  return saveBookingRequestRemote({
    bookingType: "retreat",
    retreatSlug: "kindness-camp",
    arrivalDate: "2026-07-12",
    departureDate: "2026-07-19",
    adults: 2,
    children: 0,
    guestLanguage: "en",
    preferredContact: "whatsapp",
    airportPickup: true,
    name: "Sample Guest",
    email: "guest@example.com",
    phone: "+255 700 000 000",
    country: "Germany",
    dietaryNeeds: "Halal meals and one vegetarian option",
    message: "We are interested in a service-focused retreat and would like availability and deposit details.",
  });
}

export function summarizeBookingStats(records = []) {
  const total = records.length;
  const newCount = records.filter((record) => record.status === "new").length;
  const highPriority = records.filter((record) => record.priority === "high").length;
  const confirmed = records.filter((record) => record.status === "confirmed").length;
  const bedsRequested = records
    .filter((record) => record.status !== "cancelled")
    .reduce((sum, record) => sum + (record.guests || 0), 0);

  return {
    total,
    newCount,
    highPriority,
    confirmed,
    bedsRequested,
  };
}

export function getStatusLabel(status) {
  return statusLabel(status);
}

export function getBookingBackendMode() {
  return getBackendMode();
}

export async function getStaffSession() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onStaffAuthChange(callback) {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function signInStaff(email, password) {
  if (!isSupabaseConfigured) {
    return { session: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutStaff() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
