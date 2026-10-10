import SEO from "../components/SEO";
import ProgrammeSlider from "../components/ProgrammeSlider";
import { useLanguage } from "../context/LanguageContext";
import { SITE, SPICE_ROUTE_CAFE } from "../data/siteConfig";
import { campusProgramme } from "../data/campusProgramme";

// October is the editorial edition requested by the team, not the device month.
export default function WhatsHappening() {
  const { tx } = useLanguage();

  return (
    <main id="main-content" className="happenings-page">
      <SEO
        title="What’s happening? | Karibu Assalam"
        description="Join our weekly campus tours and Swahili cooking classes in October 2026, and discover more events around Zanzibar."
        image={campusProgramme.activities[0].image}
      />
      <div className="container happenings-shell">
        <header className="happenings-intro">
          <p className="eyebrow">{tx("Workshops, tours and special events")}</p>
          <h1>{tx("What is happening on campus this month?")}</h1>
        </header>

        <section className="happenings-month" aria-labelledby="programme-month">
          <header className="happenings-month-header">
            <div>
              <p className="eyebrow">{tx("Campus programme")}</p>
              <h2 id="programme-month"><time dateTime={campusProgramme.month}>{tx(campusProgramme.label)}</time></h2>
            </div>
          </header>
          <ProgrammeSlider items={campusProgramme.activities} />
        </section>

        <section className="happenings-later" aria-labelledby="happenings-later-title">
          <h2 id="happenings-later-title">{tx("What else is happening?")}</h2>
          <div className="happenings-more-grid">
            <article className="happenings-more-card">
              <p className="eyebrow">{tx("12–14 March 2027")}</p>
              <h3>{tx("Zanzibar Sufi Festival")}</h3>
              <a className="text-link" href={SITE.sufiFestivalUrl} target="_blank" rel="noopener noreferrer">
                {tx("Visit the festival site")}<span aria-hidden="true"> ↗</span>
              </a>
            </article>
            <article className="happenings-more-card">
              <p className="eyebrow">{tx("Beyond the eco-village")}</p>
              <h3>{tx("Visit us in Stone Town")}</h3>
              <p>{tx("Visit our Spice Route Cafe and discover the Spice Route Museum in Stone Town.")}</p>
              <div className="happenings-more-links">
                <a className="text-link" href={SPICE_ROUTE_CAFE.tripAdvisorUrl} target="_blank" rel="noopener noreferrer">{tx("Spice Route Cafe")}<span aria-hidden="true"> ↗</span></a>
                <a className="text-link" href={SITE.spiceRouteMuseumUrl} target="_blank" rel="noopener noreferrer">{tx("Spice Route Museum")}<span aria-hidden="true"> ↗</span></a>
              </div>
            </article>
            <article className="happenings-more-card">
              <p className="eyebrow">{tx("Stay connected")}</p>
              <h3>{tx("Follow us on Instagram")}</h3>
              <p>{tx("Follow us on Instagram and stay updated.")}</p>
              <a className="text-link" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">{tx("Follow us")}<span aria-hidden="true"> ↗</span></a>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
