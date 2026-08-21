import CTAButton from "./CTAButton";

/**
 * One alternating row: a full-bleed photograph on one side, centred copy on the
 * other. Rows alternate down the page, which gives the product itself the space
 * a card grid never does.
 */
export default function Showcase({
  name,
  promise,
  text,
  facts = [],
  price,
  image,
  alt,
  cta,
  reversed = false,
  imageWidth = 1024,
  imageHeight = 819,
  priority = false,
}) {
  return (
    <article className={`showcase ${reversed ? "is-reversed" : ""}`.trim()}>
      <div className="showcase-media">
        <img
          src={image}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "auto"}
        />
      </div>

      <div className="showcase-copy">
        <h3 className="showcase-name">{name}</h3>
        {promise && <p className="showcase-promise">{promise}</p>}
        {text && <p>{text}</p>}

        {facts.length > 0 && (
          <ul className="showcase-facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        )}

        {price && <span className="showcase-price">{price}</span>}

        {cta && (
          <CTAButton to={cta.to} href={cta.href} variant={cta.variant || "primary"}>
            {cta.label}
          </CTAButton>
        )}
      </div>
    </article>
  );
}
