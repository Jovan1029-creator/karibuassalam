import SEO from "../components/SEO";
import ProgrammeSlider from "../components/ProgrammeSlider";
import { useLanguage } from "../context/LanguageContext";
import { SITE } from "../data/siteConfig";
import { campusProgramme } from "../data/campusProgramme";

// October is the editorial edition requested by the team, not the device month.
// Replace the pending programme with confirmed details when supplied.
export default function WhatsHappening() {
  const { tx } = useLanguage();

  return (
    <main id="main-content" className="happenings-page">
      <SEO
        title="What’s happening? | Karibu Assalam"
        description="Explore campus updates for October 2026 and ask the Karibu Assalam team about confirmed events, workshops and community gatherings."
        image={campusProgramme.activities[0].image}
      />
      <div className="container happenings-shell">
        <header className="happenings-intro">
          <p className="eyebrow">{tx("What’s happening?")}</p>
          <h1>{tx("What is happening on campus this month?")}</h1>
        </header>

        <section className="happenings-month" aria-labelledby="programme-month">
          <header className="happenings-month-header">
            <div>
              <p className="eyebrow">{tx("Campus programme")}</p>
              <h2 id="programme-month"><time dateTime={campusProgramme.month}>{tx(campusProgramme.label)}</time></h2>
            </div>
            <p className="happenings-status">
              <span aria-hidden="true" />{tx("Programme coming soon")}
            </p>
          </header>
          <p className="happenings-intro-copy">{tx("Explore a few of our campus activities below. October dates will be added once confirmed.")}</p>
          <ProgrammeSlider items={campusProgramme.activities} />
          <p className="happenings-social">
            <a className="text-link" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
              {tx("Follow on Instagram")}<span aria-hidden="true"> ↗</span>
            </a>
          </p>
        </section>

        <section className="happenings-later" aria-labelledby="happenings-later-title">
          <h2 id="happenings-later-title">{tx("What is happening later?")}</h2>
          <p>{tx("More dates will be shared here once confirmed.")}</p>
        </section>
      </div>
    </main>
  );
}
