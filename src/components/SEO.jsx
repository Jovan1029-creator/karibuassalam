import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";

function upsert(tag, selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

// Social previews need absolute URLs; a bundled relative path renders no image
// when a link is pasted into WhatsApp.
function absolute(url) {
  if (!url) return "";
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
}

export default function SEO({ title, description, image, type = "website" }) {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const canonical = absolute(pathname);
    const imageUrl = absolute(image || SITE.logoSrc);

    document.title = title;
    upsert("meta", 'meta[name="description"]', { name: "description", content: description });
    upsert("link", 'link[rel="canonical"]', { rel: "canonical", href: canonical });

    upsert("meta", 'meta[property="og:title"]', { property: "og:title", content: title });
    upsert("meta", 'meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsert("meta", 'meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsert("meta", 'meta[property="og:url"]', { property: "og:url", content: canonical });
    upsert("meta", 'meta[property="og:type"]', { property: "og:type", content: type });
    upsert("meta", 'meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE.brandName,
    });
    upsert("meta", 'meta[property="og:locale"]', {
      property: "og:locale",
      content: { en: "en_GB", tr: "tr_TR", de: "de_DE" }[language] ?? "en_GB",
    });

    upsert("meta", 'meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsert("meta", 'meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsert("meta", 'meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsert("meta", 'meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
  }, [title, description, image, type, pathname, language]);

  return null;
}
