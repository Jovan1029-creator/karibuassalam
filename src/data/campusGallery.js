import ocean from "../../pics/site-marketing/campus-2026/01-campus-ocean-view.webp";
import oceanThumb from "../../pics/site-marketing/campus-2026/01-campus-ocean-view-thumb.webp";
import celebration from "../../pics/site-marketing/campus-2026/02-campus-celebration.webp";
import celebrationThumb from "../../pics/site-marketing/campus-2026/02-campus-celebration-thumb.webp";
import courtyard from "../../pics/site-marketing/campus-2026/03-campus-life.webp";
import courtyardThumb from "../../pics/site-marketing/campus-2026/03-campus-life-thumb.webp";
import ramadan from "../../pics/site-marketing/campus-2026/04-campus-ramadhan.webp";
import ramadanThumb from "../../pics/site-marketing/campus-2026/04-campus-ramadhan-thumb.webp";
import dance from "../../pics/site-marketing/campus-2026/05-school-mother-language-event.webp";
import danceThumb from "../../pics/site-marketing/campus-2026/05-school-mother-language-event-thumb.webp";
import gathering from "../../pics/site-marketing/campus-2026/06-school-election-event.webp";
import gatheringThumb from "../../pics/site-marketing/campus-2026/06-school-election-event-thumb.webp";
import room from "../../pics/site-marketing/campus-2026/07-room-replacement.webp";
import roomThumb from "../../pics/site-marketing/campus-2026/07-room-replacement-thumb.webp";
import garden from "../../pics/site-marketing/campus-2026/08-school-permaculture.webp";
import gardenThumb from "../../pics/site-marketing/campus-2026/08-school-permaculture-thumb.webp";
import performance from "../../pics/site-marketing/campus-2026/09-school-mother-language-day.webp";
import performanceThumb from "../../pics/site-marketing/campus-2026/09-school-mother-language-day-thumb.webp";
import mosque from "../../pics/site-marketing/campus-2026/11-mango-mosque.webp";
import mosqueThumb from "../../pics/site-marketing/campus-2026/11-mango-mosque-thumb.webp";
import festival from "../../pics/site-marketing/campus-2026/12-sufi-festival.webp";
import festivalThumb from "../../pics/site-marketing/campus-2026/12-sufi-festival-thumb.webp";
import restaurant from "../../pics/site-marketing/campus-2026/14-restaurant.webp";
import restaurantThumb from "../../pics/site-marketing/campus-2026/14-restaurant-thumb.webp";
import soap from "../../pics/site-marketing/campus-2026/15-soap-workshop.webp";
import soapThumb from "../../pics/site-marketing/campus-2026/15-soap-workshop-thumb.webp";

// Subjects were checked against the actual photographs, not the conflicting
// Drive labels. Keep the original files in pics/new unchanged.
export const campusLifePhotos = [
  { src: ocean, thumb: oceanThumb, width: 1600, height: 901, label: "Quiet moments by the ocean", alt: "A guest reading on the wooden terrace overlooking the turquoise ocean" },
  { src: celebration, thumb: celebrationThumb, width: 1600, height: 1067, label: "Celebrating together", alt: "A community celebration with balloons under a thatched campus roof" },
  { src: courtyard, thumb: courtyardThumb, width: 1600, height: 1067, label: "Time to connect", alt: "Two guests talking in the shaded campus courtyard" },
  { src: ramadan, thumb: ramadanThumb, width: 1600, height: 1069, label: "Giving back during Ramadan", alt: "Volunteers preparing woven baskets filled with food supplies" },
  { src: dance, thumb: danceThumb, width: 1200, height: 1600, label: "Celebrating language and culture", alt: "Students dancing in patterned textiles at a Mother Language Day event", position: "50% 35%" },
  { src: gathering, thumb: gatheringThumb, width: 1600, height: 1200, label: "Our school community", alt: "Students and visitors gathered in the school hall" },
  { src: garden, thumb: gardenThumb, width: 1200, height: 1600, label: "Learning in the garden", alt: "A student tending a young plant in the school garden", position: "50% 35%" },
  { src: performance, thumb: performanceThumb, width: 1200, height: 1600, label: "Young voices on stage", alt: "Students performing with a microphone at a Mother Language Day celebration", position: "50% 35%" },
];

export const campusVenuePhotos = {
  room: { src: room, thumb: roomThumb, width: 1200, height: 1600, label: "Accommodation", alt: "Guest room with mosquito-netted beds at Karibu Assalam Eco-Village" },
  school: campusLifePhotos[6],
  mosque: { src: mosque, thumb: mosqueThumb, width: 810, height: 1080, label: "Campus mosque", alt: "Prayer mats and bookshelves inside the campus mosque", position: "50% 30%" },
  festival: { src: festival, thumb: festivalThumb, width: 1600, height: 1067, label: "Zanzibar Sufi Festival", alt: "Singers and musicians performing at the Zanzibar Sufi Festival" },
  restaurant: { src: restaurant, thumb: restaurantThumb, width: 1600, height: 901, label: "Istanbul restaurant", alt: "Guests serving a freshly prepared meal in the campus restaurant" },
  soap: { src: soap, thumb: soapThumb, width: 1067, height: 1600, label: "Hamamni", alt: "Hands holding a stack of handmade Hamamni soap bars", position: "50% 40%" },
};

export function campusPhotoSrcSet(photo) {
  const thumbWidth = Math.round(photo.width * Math.min(640 / photo.width, 640 / photo.height, 1));
  return `${photo.thumb} ${thumbWidth}w, ${photo.src} ${photo.width}w`;
}

export const campusLifeLightboxPhotos = campusLifePhotos.map(photo => ({ ...photo, image: photo.src }));
