import { SITE } from "./siteConfig";

// Editorial excerpts, not a live feed or a combined rating. The two venues'
// reviews must stay separate: these are for the Foundation, not the cafe.
export const reviewSources = {
  google: { platform: "Google", href: SITE.googleMapsUrl, linkLabel: "Read Google reviews" },
  tripadvisor: { platform: "Tripadvisor", href: SITE.foundationTripAdvisorUrl, linkLabel: "Read Tripadvisor reviews" },
};

// Google text supplied by the user on 2026-10-09 (pasted text and attachment).
// Preserve original wording. Relative dates and star glyphs do not establish
// reliable publication dates or ratings, so neither is inferred or displayed.
// Tripadvisor excerpts checked on the Foundation listing on 2026-10-09.
export const guestReviews = [
  {
    id: "google-monem-daymi", source: "google", author: "Monem Daymi",
    text: "Vassalam Ecovillage is truly a hidden gem in Zanzibar. This is much more than a place to stay, it is a meaningful project combining hospitality, education, sustainability, and humanitarian work in one inspiring space.",
  },
  {
    id: "google-turan-akgun", source: "google", author: "Turan Akgün",
    text: "There are places in the world where goodness and beauty converge. There, you can experience peace, tranquility of mind, pure friendship, and humanity all at once. Assalam Community is one such place.",
  },
  {
    id: "tripadvisor-seren", source: "tripadvisor", author: "Seren P", date: "2025-09-06",
    text: "I had a really lovely time, I felt incredibly welcome.",
  },
  {
    id: "google-muhammad", source: "google", author: "Muhammad Romadhon Mubarok",
    text: "Amazing place to volunteer! People are very warm, friendly, and helpful. If you are looking for a place to contribute to the direct local community in Zanzibar; Assalam Community Foundation is one of the best places to do it. If I get a chance, I'll definitely visit again!",
  },
  {
    id: "google-lamaar", source: "google", author: "Lamaar Malik",
    text: "At that point the conversation ended abruptly and I discovered that I had been blocked on WhatsApp in the middle of the exchange. The person contacting me had also not introduced themselves by name. In my opinion, this type of communication is very unprofessional and a red flag for an organisation working with volunteers.",
    response: {
      text: "We are so sorry for it and trying to find your application in our forms so contact you back. We couldn’t reach any of your information or WhatsApp messages anywhere.",
    },
  },
  {
    id: "google-venance", source: "google", author: "Venance Dulle",
    text: "It is amazing place for Zanzibar 🇹🇿 a peaceful environment, I love to spend my time here ✨",
  },
  {
    id: "google-shan", source: "google", author: "shan ali sumar",
    text: "Amazing place, to permaculture garden and melting pot ✨",
  },
  {
    id: "tripadvisor-tailor", source: "tripadvisor", author: "A Tailor", date: "2024-10-15",
    text: "Met other guests from around the world to share experiences!",
  },
  {
    id: "google-cihan", source: "google", author: "Cihan",
    text: "I met lots of so valuable and professional people in their own subjects. Im so happy to spent 4 days there. Planning to go there again in next annual leave. If you only care comfort and lux holiday this is not for you.",
  },
  {
    id: "google-cengizhan", source: "google", author: "Cengizhan Atlihan",
    text: "A wonderful initiative, great projects came and coming alive. We were lucky to be a part of a week long voluntary work during Ramadan Eid in 2023, very rewarding experience…",
  },
  {
    id: "google-suliman", source: "google", author: "Suliman Albimani",
    text: "Nice area and good job they are doing. Pls give them support.",
  },
  {
    id: "google-hayrunnisa", source: "google", author: "Hayrunnisa E",
    text: "When you enter Assalam, you soon feel like at home 🤍",
  },
];
