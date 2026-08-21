import Section from "./Section";
import { useLanguage } from "../context/LanguageContext";

// Quotes are stored in English and translated like any other string, so an
// English visitor is never shown a review they cannot read. The Turkish entries
// are the guests' own words.
const testimonials = [
  {
    name: "Esma Baysan",
    text: "My experience at Assalam was genuinely special. From the very first day you feel the sincerity and the warm energy there. Seeing people from different cultures come together with good intentions and a beautiful purpose moved me deeply.",
  },
  {
    name: "Emine Yazıcı",
    text: "I am so glad I could donate, take part in the volunteer activities and travel at the same time. I am very happy to have joined such a beautiful programme and I recommend it to everyone.",
  },
  {
    name: "Didem Gür",
    text: "Paradise-like nature, clean and safe environment, and wonderful people from all over the world with good intentions led to some of the most incredible experiences of my life.",
  },
  {
    name: "Rümeysa Erdoğan",
    text: "Touching people's hearts in the middle of the Indian Ocean, supporting employment and education, and spending a meaningful week in Zanzibar was like a dream.",
  },
  {
    name: "Ferhunde Özbayrak",
    text: "I genuinely feel like I have a new home. I know I would come back again and again with complete peace of mind.",
  },
  {
    name: "Anonymous",
    text: "The first day and the introduction were incredible for me. What I saw and heard made me feel I was somewhere very special.",
  },
];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function Testimonials() {
  const { tx } = useLanguage();
  // Personal names are the same in every language; only the placeholder needs
  // translating.
  const displayName = (name) => (name === "Anonymous" ? tx(name) : name);

  return (
    <Section
      eyebrow={tx("Guest Voices")}
      title={tx("Stories from people who joined Assalam")}
      subtitle={tx(
        "Travelers and volunteers describe Karibu Assalam as warm, meaningful, safe, and deeply connected to the community."
      )}
      className="testimonials-section surface-section"
    >
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <figure className="testimonial-card" key={testimonial.name}>
            <blockquote>
              <p>{tx(testimonial.text)}</p>
            </blockquote>
            <figcaption className="testimonial-card-header">
              <span className="testimonial-avatar" aria-hidden="true">
                <span className="testimonial-avatar-fallback">
                  {initials(displayName(testimonial.name))}
                </span>
              </span>
              <span className="testimonial-name">{displayName(testimonial.name)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
