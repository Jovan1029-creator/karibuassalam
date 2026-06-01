export default function Section({
  id,
  title,
  subtitle,
  eyebrow,
  className = "",
  containerClassName = "",
  children,
}) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className={`container ${containerClassName}`.trim()}>
        {(eyebrow || title || subtitle) && (
          <header className="section-header">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {subtitle && <p className="lead">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
