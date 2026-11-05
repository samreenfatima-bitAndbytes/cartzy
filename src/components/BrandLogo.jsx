export default function BrandLogo({ className = "" }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src="/logo.svg"
      alt=""
      width={28}
      height={28}
      decoding="async"
    />
  );
}
