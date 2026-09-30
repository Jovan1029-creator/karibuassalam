import elephant from "../../pics/safari/elephant-savannah.jpeg";
import zebras from "../../pics/safari/zebras-woodland.jpeg";
import giraffe from "../../pics/safari/giraffe-browsing.jpeg";
import zebra from "../../pics/safari/zebra-monochrome.jpeg";
import vehicle from "../../pics/safari/open-safari-vehicle.png";

// User-supplied mainland safari photographs. Blue Safari is a separate ocean trip.
export const safariHeroPhoto = {
  src: zebras,
  alt: "Three zebras standing in open woodland",
  width: 1600,
  height: 1200,
  position: "72% 45%",
};

export const safariOverviewPhoto = {
  src: zebra,
  alt: "A zebra facing the camera in a black-and-white photograph",
  width: 2561,
  height: 3407,
};

export const safariPlanningPhoto = {
  src: elephant,
  alt: "An elephant walking through dry savannah",
  width: 1200,
  height: 1600,
};

export const safariGalleryPhotos = [
  {
    src: giraffe,
    alt: "A giraffe browsing beside a leafy tree",
    label: "Giraffe in the woodland",
    width: 1200,
    height: 1600,
  },
  {
    ...safariOverviewPhoto,
    label: "A zebra in black and white",
  },
  {
    src: vehicle,
    alt: "Guests seated in an open safari vehicle",
    label: "Out on safari",
    width: 1086,
    height: 1448,
  },
];
