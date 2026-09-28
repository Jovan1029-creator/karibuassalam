import { useLanguage } from "../context/LanguageContext";

export default function PhotoCardMedia({ photo }) {
  const { tx } = useLanguage();
  if (!photo) return null;

  return (
    <img
      className="content-card-photo"
      src={photo.src}
      alt={tx(photo.alt)}
      style={photo.position ? { objectPosition: photo.position } : undefined}
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
    />
  );
}
