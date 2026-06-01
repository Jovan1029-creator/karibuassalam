import CTAButton from "./CTAButton";

export default function Hero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  ctaPrimary,
  ctaSecondary,
  align = "left",
  compact = false,
}) {
  return (
    <section className={`hero ${compact ? "compact" : ""} align-${align}`}>
      {imageSrc && (
        <div className="hero-media" aria-hidden={imageAlt ? undefined : "true"}>
          <img
            src={imageSrc}
            alt={imageAlt}
            loading={compact ? "lazy" : "eager"}
            decoding="async"
            fetchPriority={compact ? "auto" : "high"}
          />
          <div className="hero-overlay" />
        </div>
      )}
      <div className="container hero-content">
        <div className="hero-panel">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {subtitle && <p className="lead">{subtitle}</p>}
          {(ctaPrimary || ctaSecondary) && (
            <div className="inline-actions">
              {ctaPrimary && <CTAButton {...ctaPrimary}>{ctaPrimary.label}</CTAButton>}
              {ctaSecondary && <CTAButton {...ctaSecondary}>{ctaSecondary.label}</CTAButton>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
