import CTAButton from "./CTAButton";
import { buildWhatsAppUrl } from "../utils/contact";

export default function WhatsAppButton({ payload, label = "WhatsApp Us", ...rest }) {
  return <CTAButton href={buildWhatsAppUrl(payload)} {...rest}>{label}</CTAButton>;
}
