import TornEdge from "./TornEdge";
import Ornament from "./Ornament";

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
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2 className="script-heading">{title}</h2>}
              <Ornament />
              {subtitle && <p className="section-lead">{subtitle}</p>}
            </header>
          ) : (
            <header className="section-header">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2>{title}</h2>}
              {subtitle && <p className="lead">{subtitle}</p>}
            </header>
          ))}
        {children}
      </div>
      {tornBottom && <TornEdge position="bottom" color={tornBottom} className="torn-abs torn-abs-bottom" />}
    </section>
  );
}
