import { Link } from "react-router-dom";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import { SITE } from "../data/siteConfig";
import campusImg from "../../pics/site-marketing/campus-amphitheatre.webp";

// October is the editorial edition requested by the team, not the device month.
// Replace the pending programme with confirmed details when supplied.
export default function WhatsHappening() {
  const { tx } = useLanguage();

  return (
    <main id="main-content" className="happenings-page">
      <SEO
        title="What’s happening? | Karibu Assalam"
        description="Explore campus updates for October 2026 and ask the Karibu Assalam team about confirmed events, workshops and community gatherings."
        image={campusImg}
      />
      <div className="container happenings-shell">
        <header className="happenings-intro">
          <p className="eyebrow">{tx("What’s happening?")}</p>
          <h1>{tx("What is happening on campus this month?")}</h1>
        </header>

        <section className="happenings-month" aria-labelledby="programme-month">
          <div className="happenings-photo">
            <img
              src={campusImg}
              alt={tx("The open-air amphitheatre at Karibu Assalam")}
              width="1200"
              height="800"
              decoding="async"
              fetchpriority="high"
            />
          </div>
          <div className="happenings-programme">
            <p className="eyebrow">{tx("Campus programme")}</p>
            <h2 id="programme-month"><time dateTime="2026-10">{tx("October 2026")}</time></h2>
            <p className="happenings-status">
              <span aria-hidden="true" />{tx("Programme coming soon")}
            </p>
            <p>{tx("For confirmed events, workshops and community gatherings this month, please contact the Karibu Assalam team.")}</p>
            <div className="happenings-actions">
              <CTAButton to="/contact">Ask about the programme</CTAButton>
              <a className="text-link" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
                {tx("Follow on Instagram")}<span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="happenings-later" aria-labelledby="happenings-later-title">
          <h2 id="happenings-later-title">{tx("What is happening later?")}</h2>
          <Link className="text-link" to="/contact">
            {tx("Ask about upcoming dates")}<span aria-hidden="true"> →</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
