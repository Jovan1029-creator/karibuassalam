import TornEdge from "./TornEdge";
import Ornament from "./Ornament";
import { useLanguage } from "../context/LanguageContext";

export default function Section({
  id,
  title,
  subtitle,
  eyebrow,
  scriptTitle = false,
  tornTop,
  tornBottom,
  className = "",
  containerClassName = "",
  children,
}) {
  const { tx } = useLanguage();
  return (
    <section
      id={id}
      className={["section", tornTop || tornBottom ? "has-torn" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {tornTop && <TornEdge position="top" color={tornTop} className="torn-abs torn-abs-top" />}
      <div className={`container ${containerClassName}`.trim()}>
        {(eyebrow || title || subtitle) &&
          (scriptTitle ? (
            <header className="section-header is-script">
              {eyebrow && <p className="eyebrow">{tx(eyebrow)}</p>}
              {title && <h2 className="script-heading">{tx(title)}</h2>}
              <Ornament />
              {subtitle && <p className="section-lead">{tx(subtitle)}</p>}
            </header>
          ) : (
            <header className="section-header">
              {eyebrow && <p className="eyebrow">{tx(eyebrow)}</p>}
              {title && <h2>{tx(title)}</h2>}
              {subtitle && <p className="lead">{tx(subtitle)}</p>}
            </header>
          ))}
        {children}
      </div>
      {tornBottom && <TornEdge position="bottom" color={tornBottom} className="torn-abs torn-abs-bottom" />}
    </section>
  );
}
