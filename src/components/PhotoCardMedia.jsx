import { useLanguage } from "../context/LanguageContext";
import { campusPhotoSrcSet } from "../data/campusGallery";

export default function PhotoCardMedia({ photo }) {
  const { tx } = useLanguage();
  if (!photo) return null;

  return (
    <img
      className="content-card-photo"
      src={photo.src}
      srcSet={photo.thumb ? campusPhotoSrcSet(photo) : undefined}
      sizes={photo.thumb ? "(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 400px" : undefined}
      alt={tx(photo.alt)}
      style={{ objectPosition: photo.position, objectFit: photo.fit || (photo.height > photo.width ? "contain" : "cover") }}
      width={photo.width || 1200}
      height={photo.height || 800}
      loading="lazy"
      decoding="async"
    />
  );
}
