import { useEffect } from "react";
import { SITE } from "../data/siteConfig";

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

export default function SEO({ title, description, image, type = "website" }) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image || SITE.logoSrc,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
  }, [title, description, image, type]);

  return null;
}
