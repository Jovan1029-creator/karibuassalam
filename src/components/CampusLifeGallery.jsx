import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { campusLifePhotos, campusLifeLightboxPhotos, campusPhotoSrcSet } from "../data/campusGallery";
import Lightbox from "./Lightbox";

export default function CampusLifeGallery() {
  const { tx } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <div className="campus-life-gallery">
        {campusLifePhotos.map((photo, index) => (
          <figure className="campus-life-photo" key={photo.src}>
            <button
              className="campus-life-open"
              type="button"
              aria-label={`${tx(photo.label)} - ${tx("View photo")}`}
              aria-haspopup="dialog"
              onClick={() => setOpenIndex(index)}
            >
              <img
                src={photo.thumb || photo.src}
                srcSet={campusPhotoSrcSet(photo)}
                sizes="(max-width: 540px) calc(100vw - 40px), (max-width: 1100px) 45vw, 280px"
                alt={tx(photo.alt)}
                width={photo.width}
                height={photo.height}
                style={photo.position ? { objectPosition: photo.position } : undefined}
                loading="lazy"
                decoding="async"
              />
              <span className="campus-life-zoom" aria-hidden="true">+</span>
            </button>
            <figcaption>{tx(photo.label)}</figcaption>
          </figure>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox items={campusLifeLightboxPhotos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
