import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { BOOKING_STATUSES, PLANNING_CAPACITY } from "../data/bookingOptions";
import { SITE } from "../data/siteConfig";
import {
  createSampleBookingRemote,
  deleteBookingRequestRemote,
  getBookingBackendMode,
  getStaffSession,
  getStatusLabel,
  loadBookingRequests,
  onStaffAuthChange,
  signInStaff,
  signOutStaff,
  subscribeToBookingRequests,
  summarizeBookingStats,
  updateBookingStatusRemote,
} from "../utils/bookingAutomation";
import { buildBookingMessage } from "../utils/bookingAutomation";
import { useLanguage } from "../context/LanguageContext";
import adminImg from "../../pics/rooms/Image-2-edited-enhanced.webp";

function formatDateTime(value, language, tx) {
  if (!value) return tx("Not set");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value, language, tx) {
  if (!value) return tx("Not set");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSyncTime(value, language, tx) {
  if (!value) return tx("Waiting for first sync");
  return value.toLocaleTimeString(language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function outboundUrl(record, channel) {
  const message = buildBookingMessage(record);
  if (channel === "email") {
    const subject = record.retreatTitle
      ? `Booking Request - ${record.retreatTitle}`
      : `Booking Request - ${record.id}`;
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${SITE.whatsAppPhone}?text=${encodeURIComponent(message)}`;
}

export default function AdminDashboard() {
  const { tx, language } = useLanguage();
  const backendMode = getBookingBackendMode();
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [liveSyncState, setLiveSyncState] = useState("idle");

  const stats = useMemo(() => summarizeBookingStats(records), [records]);
  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        if (statusFilter === "all") return true;
        return record.status === statusFilter;
      }),
    [records, statusFilter]
  );
  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedId) ||
    filteredRecords[0] ||
    records.find((record) => record.id === selectedId) ||
    records[0] ||
    null;

  useEffect(() => {
    let active = true;

    async function boot() {
      setIsLoading(true);
      try {
        const nextSession = await getStaffSession();
        if (!active) return;
        setSession(nextSession);

        if (backendMode === "supabase" && !nextSession) {
          setRecords([]);
          setSelectedId("");
          return;
        }

        const nextRecords = await loadBookingRequests();
        if (!active) return;
        setRecords(nextRecords);
        setLastSyncedAt(new Date());
        setSelectedId((current) =>
          nextRecords.some((record) => record.id === current) ? current : nextRecords[0]?.id || ""
        );
      } catch (error) {
        if (active) setNotice({ message: "Could not load booking requests.", detail: error.message || "" });
      } finally {
        if (active) setIsLoading(false);
      }
    }

    boot();

    const unsubscribe = onStaffAuthChange((nextSession) => {
      setSession(nextSession);
      if (!nextSession && backendMode === "supabase") {
        setRecords([]);
        setSelectedId("");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [backendMode]);

  async function refresh({ silent = false } = {}) {
    if (!silent) setIsLoading(true);
    try {
      const nextRecords = await loadBookingRequests();
      setRecords(nextRecords);
      setLastSyncedAt(new Date());
      setSelectedId((current) =>
        nextRecords.some((record) => record.id === current) ? current : nextRecords[0]?.id || ""
      );
      return nextRecords;
    } catch (error) {
      setNotice({ message: "Could not load booking requests.", detail: error.message || "" });
      return records;
    } finally {
      if (!silent) setIsLoading(false);
    }
  }

  useEffect(() => {
    if (backendMode !== "supabase" || !session) return undefined;

    let refreshing = false;

    async function refreshQuietly() {
      if (refreshing) return;
      refreshing = true;
      try {
        await refresh({ silent: true });
      } finally {
        refreshing = false;
      }
    }

    const unsubscribe = subscribeToBookingRequests(refreshQuietly, setLiveSyncState);
    const pollTimer = window.setInterval(refreshQuietly, 30000);

    return () => {
      window.clearInterval(pollTimer);
      unsubscribe();
    };
  }, [backendMode, session]);

  async function handleStatusChange(event) {
    if (!selectedRecord) return;
    try {
      const next = await updateBookingStatusRemote(selectedRecord.id, event.target.value);
      setRecords(next);
      setNotice({ message: "Booking status updated." });
    } catch (error) {
      setNotice({ message: "Booking status could not be updated.", detail: error.message || "" });
    }
  }

  async function handleSeed() {
    try {
      const record = await createSampleBookingRemote();
      await refresh();
      setSelectedId(record.id);
      setNotice({ message: "Sample inquiry added for testing the automation dashboard." });
    } catch (error) {
      setNotice({ message: "Sample inquiry could not be added.", detail: error.message || "" });
    }
  }

  async function handleDelete() {
    if (!selectedRecord) return;
    const confirmed = window.confirm(tx("Delete this booking request?"));
    if (!confirmed) return;
    try {
      const next = await deleteBookingRequestRemote(selectedRecord.id);
      setRecords(next);
      setSelectedId(next[0]?.id || "");
      setNotice({ message: "Booking request removed." });
    } catch (error) {
      setNotice({ message: "Booking request could not be removed.", detail: error.message || "" });
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setIsSigningIn(true);
    setNotice("");
    try {
      const data = await signInStaff(authForm.email, authForm.password);
      setSession(data.session);
      await refresh();
      setNotice({ message: "Signed in. Booking requests loaded from Supabase." });
    } catch (error) {
      setNotice({ message: "Staff sign in failed.", detail: error.message || "" });
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOutStaff();
      setSession(null);
      setRecords([]);
      setSelectedId("");
      setNotice({ message: "Signed out." });
    } catch (error) {
      setNotice({ message: "Sign out failed.", detail: error.message || "" });
    }
  }

  async function copyReplyDraft() {
    if (!selectedRecord?.replyDraft) return;
    try {
      await navigator.clipboard.writeText(selectedRecord.replyDraft);
      setNotice({ message: "Reply draft copied." });
    } catch {
      setNotice({ message: "Copy failed. You can still select the draft manually." });
    }
  }

  return (
    <main id="main-content">
      <SEO
        title={tx("Karibu Assalam Admin | Booking Automation Dashboard")}
        description={tx(
          "Local Karibu Assalam operations dashboard for booking requests, lead triage, status tracking, and reply drafts."
        )}
        image={adminImg}
      />
      <Hero
        eyebrow={tx("Admin")}
        title={tx("Booking automation dashboard")}
        subtitle={tx(
          "Track inquiries, see automated triage, prepare replies, and move each guest from request to confirmation."
        )}
        imageSrc={adminImg}
        imageAlt="Karibu Assalam eco-village operations view"
        compact
      />

      <Section
        title={tx("Operations inbox")}
        subtitle={tx(
          backendMode === "supabase"
            ? "This dashboard is connected to Supabase. Staff must sign in before reading, updating, or deleting booking requests."
            : "This dashboard is using local storage until Supabase environment keys are configured."
        )}
      >
        <div className="mode-banner">
          <span>
            <strong>{tx("Backend mode")}:</strong>{" "}
            {backendMode === "supabase" ? tx("Supabase") : tx("Local fallback")}
          </span>
          {backendMode === "supabase" && session ? (
            <span className="admin-sync-status">
              <span className={`sync-dot ${liveSyncState === "SUBSCRIBED" ? "" : "is-connecting"}`} aria-hidden="true" />
              {tx(liveSyncState === "SUBSCRIBED" ? "Live inbox connected" : "Connecting live inbox")}
              <small>{tx("Last sync")}: {formatSyncTime(lastSyncedAt, language, tx)}</small>
            </span>
          ) : null}
        </div>

        {notice ? <p className="form-status" role="status">{tx(notice.message)} {notice.detail}</p> : null}

        {backendMode === "supabase" && !session ? (
          <form className="admin-login" onSubmit={handleSignIn}>
            <h3>{tx("Staff sign in")}</h3>
            <p>
              {tx(
                "Use a Supabase Auth staff account that has a matching row in the staff profiles table."
              )}
            </p>
            <div className="form-grid two">
              <div className="form-field">
                <label htmlFor="staffEmail">{tx("Email")}</label>
                <input
                  id="staffEmail"
                  type="email"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((current) => ({ ...current, email: event.target.value }))
                  }
                  autoComplete="email"
                />
              </div>
              <div className="form-field">
                <label htmlFor="staffPassword">{tx("Password")}</label>
                <input
                  id="staffPassword"
                  type="password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((current) => ({ ...current, password: event.target.value }))
                  }
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSigningIn}>
              {tx(isSigningIn ? "Signing in..." : "Sign in")}
            </button>
          </form>
        ) : (
          <>
        <div className="admin-stats">
          <article className="stat-card">
            <span>{tx("Total requests")}</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span>{tx("New")}</span>
            <strong>{stats.newCount}</strong>
          </article>
          <article className="stat-card">
            <span>{tx("High priority")}</span>
            <strong>{stats.highPriority}</strong>
          </article>
          <article className="stat-card">
            <span>{tx("Beds requested")}</span>
            <strong>{stats.bedsRequested}</strong>
          </article>
          <article className="stat-card">
            <span>{tx("Confirmed")}</span>
            <strong>{stats.confirmed}</strong>
          </article>
        </div>

        <div className="admin-toolbar">
          <div className="form-field compact-field">
            <label htmlFor="statusFilter">{tx("Filter")}</label>
            <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{tx("All statuses")}</option>
              {BOOKING_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {tx(status.label)}
                </option>
              ))}
            </select>
          </div>
          <div className="inline-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleSeed}>
              {tx("Add sample inquiry")}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => refresh()}>
              {tx("Refresh")}
            </button>
            {backendMode === "supabase" ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                {tx("Sign out")}
              </button>
            ) : null}
          </div>
        </div>

        {isLoading ? <p className="form-status" role="status">{tx("Loading booking requests...")}</p> : null}

        <div className="admin-layout">
          <div className="booking-inbox" aria-label={tx("Booking requests")}>
            {filteredRecords.length ? (
              filteredRecords.map((record) => (
                <button
                  type="button"
                  key={record.id}
                  className={`booking-row ${selectedRecord?.id === record.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(record.id)}
                >
                  <span className="booking-row-top">
                    <strong>{record.name || tx("Unnamed guest")}</strong>
                    <span className={`status-pill priority-${record.priority}`}>{tx(record.priority)}</span>
                  </span>
                  <span>{tx(record.retreatTitle || record.bookingType)}</span>
                  <span className="booking-row-meta">
                    {formatDate(record.arrivalDate, language, tx)} - {record.guests} {tx("guest(s)")} - {tx(getStatusLabel(record.status))}
                  </span>
                </button>
              ))
            ) : (
              <div className="empty-state">
                <h3>{tx("No booking requests yet")}</h3>
                <p>{tx("Submit a booking form or add a sample inquiry to test the workflow.")}</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSeed}>
                  {tx("Add sample inquiry")}
                </button>
              </div>
            )}
          </div>

          <article className="booking-detail">
            {selectedRecord ? (
              <>
                <div className="detail-header">
                  <div>
                    <p className="eyebrow">{selectedRecord.id}</p>
                    <h3>{selectedRecord.name || tx("Unnamed guest")}</h3>
                    <p>{tx("{name} · {request} · {count} guest(s) · Arrival: {date}", {
                      name: selectedRecord.name || tx("Unnamed guest"),
                      request: tx(selectedRecord.retreatTitle || selectedRecord.bookingType),
                      count: selectedRecord.guests,
                      date: formatDate(selectedRecord.arrivalDate, language, tx),
                    })}</p>
                  </div>
                  <span className={`status-pill priority-${selectedRecord.priority}`}>{tx(selectedRecord.priority)}</span>
                </div>

                <div className="detail-grid">
                  <div>
                    <span>{tx("Status")}</span>
                    <select value={selectedRecord.status} onChange={handleStatusChange}>
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {tx(status.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span>{tx("Created")}</span>
                    <strong>{formatDateTime(selectedRecord.createdAt, language, tx)}</strong>
                  </div>
                  <div>
                    <span>{tx("Arrival")}</span>
                    <strong>{formatDate(selectedRecord.arrivalDate, language, tx)}</strong>
                  </div>
                  <div>
                    <span>{tx("Departure")}</span>
                    <strong>{formatDate(selectedRecord.departureDate, language, tx)}</strong>
                  </div>
                  <div>
                    <span>{tx("Guests")}</span>
                    <strong>{selectedRecord.guests}</strong>
                  </div>
                  <div>
                    <span>{tx("Estimated rooms")}</span>
                    <strong>{selectedRecord.roomsNeeded}</strong>
                  </div>
                  <div>
                    <span>{tx("Preferred language")}</span>
                    <strong>{selectedRecord.guestLanguage?.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span>{tx("Preferred contact")}</span>
                    <strong>{tx(selectedRecord.preferredContact)}</strong>
                  </div>
                </div>

                <div className="automation-note">
                  <strong>{tx("Suggested next action")}</strong>
                  <p>{tx(selectedRecord.nextAction)}</p>
                </div>

                <div className="detail-columns">
                  <section>
                    <h3>{tx("Guest details")}</h3>
                    <ul className="plain-list">
                      <li><strong>{tx("Email")}:</strong> {selectedRecord.email || tx("Not set")}</li>
                      <li><strong>{tx("Phone")}:</strong> {selectedRecord.phone || tx("Not set")}</li>
                      <li><strong>{tx("Country")}:</strong> {selectedRecord.country || tx("Not set")}</li>
                      <li><strong>{tx("Airport pickup")}:</strong> {selectedRecord.airportPickup ? tx("Yes") : tx("No")}</li>
                      <li><strong>{tx("Dietary/access")}:</strong> {selectedRecord.dietaryNeeds || tx("Not set")}</li>
                    </ul>
                  </section>

                  <section>
                    <h3>{tx("Operations notes")}</h3>
                    <ul className="plain-list">
                      <li><strong>{tx("Timing")}:</strong> {tx(selectedRecord.timing)}</li>
                      <li><strong>{tx("Trip nights")}:</strong> {selectedRecord.nights ?? tx("Not set")}</li>
                      <li><strong>{tx("Room planning")}:</strong> {tx(PLANNING_CAPACITY.note)}</li>
                    </ul>
                  </section>
                </div>

                <section className="reply-draft">
                  <div className="reply-draft-header">
                    <h3>{tx("Draft reply")}</h3>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={copyReplyDraft}>
                      {tx("Copy draft")}
                    </button>
                  </div>
                  <pre>{selectedRecord.replyDraft}</pre>
                </section>

                <div className="inline-actions">
                  <a className="btn btn-primary btn-sm" href={outboundUrl(selectedRecord, "whatsapp")} target="_blank" rel="noopener noreferrer">
                    {tx("Open WhatsApp")}
                  </a>
                  <a className="btn btn-secondary btn-sm" href={outboundUrl(selectedRecord, "email")}>
                    {tx("Open Email")}
                  </a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleDelete}>
                    {tx("Delete request")}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <h3>{tx("Select a request")}</h3>
                <p>{tx("Booking details and automation notes will appear here.")}</p>
              </div>
            )}
          </article>
        </div>
          </>
        )}
      </Section>
    </main>
  );
}
