import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function CTAButton({
  to,
  href,
  children,
  variant = "primary",
  size = "md",
  newTab = false,
  className = "",
  ...rest
}) {
  const { tx } = useLanguage();
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {tx(children)}
      </Link>
    );
  }

  return (
    <a
      className={classes}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {tx(children)}
    </a>
  );
}
