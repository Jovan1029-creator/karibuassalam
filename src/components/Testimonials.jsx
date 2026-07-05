import { useState } from "react";
import Section from "./Section";
import { useLanguage } from "../context/LanguageContext";

const testimonials = [
  {
    name: "Esma Baysan",
    image:
      "https://drive.google.com/uc?export=view&id=1TcbVMrd5yGQT_q0QJevHVj1KE_tHDs0h",
    text:
      "Assalam'daki deneyimim benim icin gercekten cok ozel. Daha ilk gunden oradaki samimiyeti ve guzel enerjiyi hissediyorsunuz. Farkli kulturlerden insanlarin iyi niyet ve guzel bir amacla bir araya gelmesi beni cok etkiledi.",
  },
  {
    name: "Emine Yazici",
    image:
      "https://drive.google.com/uc?export=view&id=1pMUxYa2jF-kCkBnkqXwBLHSNPSUKdmT8",
    text:
      "Hem bagisimi yapip hem gonullu faaliyetlerinde yer alip hem de gezdigim icin cok memnunum. Boyle guzel bir etkinlige katildigim icin cok mutluyum ve herkese oneririm.",
  },
  {
    name: "Didem Gur",
    text:
      "Paradise-like nature, clean and safe environment, and wonderful people from all over the world with good intentions led to some of the most incredible experiences of my life.",
  },
  {
    name: "Rumeysa Erdogan",
    text:
      "Hint Okyanusu'nun ortasinda insanlarin gonullerine dokunmak, istihdama ve egitime destek olmak, ayni zamanda Zanzibar'da anlamli bir hafta gecirmek bir ruya gibiydi.",
  },
  {
    name: "Ferhunde Ozbayrak",
    text:
      "Kesinlikle yeni bir yuvam var gibi hissediyorum. Tekrar tekrar gonul rahatligi ile gelecegimi dusunuyorum.",
  },
  {
    name: "Anonymous",
    text:
      "Ilk gun ve tanitim benim icin inanilmaz guzeldi. Gorduklerim ve duyduklarim, cok ozel bir ortamda oldugumu hissettirdi.",
  },
];

function TestimonialAvatar({ testimonial }) {
  const [failed, setFailed] = useState(false);
  const initials = testimonial.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  if (!testimonial.image || failed) {
    return <span className="testimonial-avatar-fallback">{initials}</span>;
  }

  return (
    <img
      src={testimonial.image}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

export default function Testimonials() {
  const { tx } = useLanguage();

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
          <article className="testimonial-card" key={testimonial.name}>
            <div className="testimonial-card-header">
              <div className="testimonial-avatar">
                <TestimonialAvatar testimonial={testimonial} />
              </div>
              <h3>{tx(testimonial.name)}</h3>
            </div>
            <p>{tx(testimonial.text)}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
