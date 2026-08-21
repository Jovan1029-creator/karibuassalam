import { useEffect, useMemo, useState } from "react";
import TornEdge from "./TornEdge";
import { Link } from "react-router-dom";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";

const ZANZIBAR_TIME_ZONE = "Africa/Dar_es_Salaam";

function getLocalStatus(date) {
  const hour = Number.parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: ZANZIBAR_TIME_ZONE,
    }).format(date),
    10
  );

  if (hour < 6) return "Quiet hours in Zanzibar";
  if (hour < 12) return "Morning at Assalam Ecolodge";
  if (hour < 17) return "Afternoon at Assalam Ecolodge";
  if (hour < 20) return "Sunset hours in Zanzibar";
  return "Evening at Assalam Ecolodge";
}

export default function LiveNowStrip() {
  const { tx } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const localTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: ZANZIBAR_TIME_ZONE,
      }).format(now),
    [now]
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="live-now-strip" aria-label={tx("Assalam Ecolodge live status")}>
      <div className="container live-now-grid">
        <div className="live-now-intro">
          <span className="live-dot" aria-hidden="true" />
          <div>
            <p className="live-now-kicker">{tx("Local time in Zanzibar")}</p>
            <strong>{localTime} EAT</strong>
            <span>{tx(getLocalStatus(now))}</span>
          </div>
        </div>

        <div className="live-now-item">
          <span>{tx("Plan your stay")}</span>
          <strong>{tx("Booking requests are open online")}</strong>
          <Link to="/booking">{tx("Start a request")}</Link>
        </div>

        <div className="live-now-item">
          <span>{tx("Stay connected")}</span>
          <strong>{tx("Questions before booking?")}</strong>
          <a href={`https://wa.me/${SITE.whatsAppPhone}`} target="_blank" rel="noopener noreferrer">
            {tx("Message us on WhatsApp")}
          </a>
        </div>
      </div>
      <TornEdge position="bottom" color="var(--bg)" className="torn-abs torn-abs-bottom" />
    </section>
  );
}
