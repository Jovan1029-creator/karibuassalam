export default function Card({ className = "", children, ...rest }) {
  return (
    <article className={`card ${className}`.trim()} {...rest}>
      {children}
    </article>
  );
}
