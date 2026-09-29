import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

// Load the actual booking module through Vite (it imports image assets), but
// use only synthetic credentials and a stubbed transport. Never send test leads.
const previousUrl = process.env.VITE_SUPABASE_URL;
const previousKey = process.env.VITE_SUPABASE_ANON_KEY;
const previousFetch = globalThis.fetch;
const previousWindow = globalThis.window;
process.env.VITE_SUPABASE_URL = "http://127.0.0.1:9";
process.env.VITE_SUPABASE_ANON_KEY = "local-booking-test-key";
globalThis.fetch = () => { throw new Error("Unexpected network call in booking tests"); };

const server = await createServer({
  configFile: false,
  mode: "test",
  logLevel: "silent",
  server: { middlewareMode: true },
  appType: "custom",
});
const { supabase } = await server.ssrLoadModule("/src/lib/supabaseClient.js");
const { saveBookingRequestRemote, buildBookingMessage } = await server.ssrLoadModule("/src/utils/bookingAutomation.js");
const originalFrom = supabase.from;

after(async () => {
  supabase.from = originalFrom;
  globalThis.fetch = previousFetch;
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;
  if (previousUrl === undefined) delete process.env.VITE_SUPABASE_URL;
  else process.env.VITE_SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.VITE_SUPABASE_ANON_KEY;
  else process.env.VITE_SUPABASE_ANON_KEY = previousKey;
  await server.close();
});

const draft = {
  name: "Test Visitor",
  email: "booking-test@example.com",
  phone: "+255000000000",
  arrivalDate: "2027-03-10",
  departureDate: "2027-03-17",
  adults: 2,
  message: "Please confirm room availability.",
};

function stubBackend(insert) {
  supabase.from = (table) => {
    assert.equal(table, "booking_requests");
    return { insert };
  };
}

function useStorage({ blocked = false } = {}) {
  const writes = [];
  globalThis.window = { localStorage: {
    getItem: () => null,
    setItem: (key, value) => {
      if (blocked) throw new Error("Storage quota exceeded");
      writes.push({ key, records: JSON.parse(value) });
    },
  } };
  return writes;
}

test("only a confirmed database insert reports successful delivery", async () => {
  const writes = useStorage();
  stubBackend(async (row) => {
    assert.equal(row.email, draft.email);
    assert.equal(row.status, "new");
    return { error: null };
  });
  const result = await saveBookingRequestRemote(draft);
  assert.equal(result.storageMode, "supabase");
  assert.equal(writes.length, 0);
});

test("network failure preserves an unsent request for direct contact", async () => {
  const writes = useStorage();
  stubBackend(async () => { throw new TypeError("Failed to fetch"); });
  const result = await saveBookingRequestRemote(draft);
  assert.equal(result.storageMode, "local-fallback");
  assert.equal(result.syncError, "Failed to fetch");
  assert.equal(writes.length, 1);
  assert.equal(writes[0].records[0].email, draft.email);
  const message = buildBookingMessage(result);
  assert.ok(message.includes(draft.arrivalDate));
  assert.ok(message.includes(draft.email));
  assert.ok(message.includes(draft.message));
});

test("a rejected database insert never reports a successful request", async () => {
  useStorage();
  stubBackend(async () => ({ error: { message: "Insert rejected" } }));
  const result = await saveBookingRequestRemote(draft);
  assert.equal(result.storageMode, "local-fallback");
  assert.equal(result.syncError, "Insert rejected");
});

test("blocked browser storage still returns the unsent request", async () => {
  useStorage({ blocked: true });
  stubBackend(async () => { throw new TypeError("Failed to fetch"); });
  const result = await saveBookingRequestRemote(draft);
  assert.equal(result.storageMode, "memory-fallback");
  assert.equal(result.email, draft.email);
  assert.equal(result.message, draft.message);
  assert.ok(buildBookingMessage(result).includes(draft.phone));
});
