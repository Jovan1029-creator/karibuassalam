import { useEffect, useMemo, useRef, useState } from "react";
import independentLogo from "../../pics/Our partners/independent.png";
import munsterLogo from "../../pics/Our partners/Logo_Universitat_Munster.png";
import tedxLogo from "../../pics/Our partners/tedx.png";
import tikaLogo from "../../pics/Our partners/TIKA-logo.png";
import topLogo from "../../pics/Our partners/top-logo2.png";
import trtLogo from "../../pics/Our partners/TRT_World-1536x217.png";
import turkishAirlinesLogo from "../../pics/Our partners/Turkish_Airlines-1536x864.png";
import zanzibarLogo from "../../pics/Our partners/Zanzibar_logo.png";
import { useLanguage } from "../context/LanguageContext";

const partners = [
  { name: "Independent", logo: independentLogo, logoScale: 2.2 },
  { name: "Universitat Munster", logo: munsterLogo },
  { name: "TEDx", logo: tedxLogo },
  { name: "TIKA", logo: tikaLogo, logoScale: 1.16 },
  { name: "Top", logo: topLogo, logoScale: 1.12 },
  { name: "TRT World", logo: trtLogo },
  { name: "Turkish Airlines", logo: turkishAirlinesLogo, logoScale: 1.18 },
  { name: "Zanzibar", logo: zanzibarLogo, logoScale: 1.15 },
];

export default function PartnerGrid() {
  const { tx } = useLanguage();
  const segmentRef = useRef(null);
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    const element = segmentRef.current;
    if (!element) return undefined;

    const measure = () => {
      setSegmentWidth(element.offsetWidth || 0);
    };

    measure();

    const images = Array.from(element.querySelectorAll("img"));
    const onAssetReady = () => measure();
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onAssetReady);
        img.addEventListener("error", onAssetReady);
      }
    });

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }

    window.addEventListener("resize", measure);

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onAssetReady);
        img.removeEventListener("error", onAssetReady);
      });
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const marqueeStyle = useMemo(() => {
    const durationSeconds = segmentWidth ? Math.max(18, Math.round(segmentWidth / 42)) : 28;
    return {
      "--partner-marquee-shift": `${segmentWidth}px`,
      "--partner-marquee-duration": `${durationSeconds}s`,
    };
  }, [segmentWidth]);

  function renderPartnerCard(partner, key, isClone = false) {
    return (
      <figure className="partner-card" key={key}>
        <img
          src={partner.logo}
          alt={isClone ? "" : `${tx(partner.name)} ${tx("logo")}`}
          loading="lazy"
          decoding="async"
          aria-hidden={isClone ? "true" : undefined}
          style={{ "--logo-scale": partner.logoScale ?? 1 }}
        />
      </figure>
    );
  }

  return (
    <div className="partner-marquee" role="region" aria-label={tx("Partner logos")}>
      <div className="partner-marquee-track" style={marqueeStyle}>
        <div className="partner-marquee-segment" ref={segmentRef}>
          {partners.map((partner) => renderPartnerCard(partner, partner.name))}
        </div>
        <div className="partner-marquee-segment" aria-hidden="true">
          {partners.map((partner) => renderPartnerCard(partner, `clone-${partner.name}`, true))}
        </div>
      </div>
    </div>
  );
}
