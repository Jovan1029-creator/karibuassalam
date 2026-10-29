import { useLanguage } from "../context/LanguageContext";

const amenities = [
  { label: "Bathroom", drawing: <><path d="M9 34h46v8a9 9 0 0 1-9 9H18a9 9 0 0 1-9-9v-8Zm6 17-2 5m36-5 2 5M15 34V15a6 6 0 0 1 12 0v3M23 18h8" /></> },
  { label: "Shower", drawing: <><path d="M16 53V17a9 9 0 0 1 18 0v5m-10 7a10 10 0 0 1 20 0H24Zm2 7v4m8-4v4m8-4v4m-16 7v4m8-4v4m8-4v4" /></> },
  { label: "Balcony / terrace", drawing: <><path d="M18 34V10h28v24M32 10v24M9 35h46v18H9V35Zm8 0v18m10-18v18m10-18v18m10-18v18M7 56h50" /></> },
  { label: "A/C", drawing: <><rect x="8" y="12" width="48" height="23" rx="4" /><path d="M16 28h32M44 19h4M20 41v5m12-5v12m12-12v5M27 49l5 4 5-4" /></> },
];

export default function RoomAmenities() {
  const { tx } = useLanguage();
  return <ul className="room-amenities" aria-label={tx("Room Features")}>
    {amenities.map(({ label, drawing }) => <li key={label}>
      <span className="room-amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{drawing}</svg>
      </span>
      <span>{tx(label)}</span>
    </li>)}
  </ul>;
}
