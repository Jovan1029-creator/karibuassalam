export const BOOKING_TYPES = [
  { value: "retreat", label: "Retreat or camp" },
  { value: "accommodation", label: "Accommodation only" },
  { value: "campus-visit", label: "Campus visit" },
  { value: "group-program", label: "Group or school program" },
  { value: "general", label: "General travel question" },
];

export const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
];

export const GUEST_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "tr", label: "Turkish" },
  { value: "sw", label: "Swahili" },
  { value: "ar", label: "Arabic" },
];

export const ROOM_TYPES = [
  { value: "not-sure", label: "Not sure yet" },
  { value: "shared-room", label: "Shared eco-village room" },
  { value: "family-room", label: "Family or private room request" },
  { value: "group-block", label: "Group room block" },
];

export const BOOKING_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "deposit-pending", label: "Deposit pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export const PLANNING_CAPACITY = {
  roomCapacityGuests: 5,
  note: "Room estimates assume the standard 5-bed room.",
};
