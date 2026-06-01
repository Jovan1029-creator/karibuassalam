import { Link } from "react-router-dom";

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
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {children}
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
      {children}
    </a>
  );
}
