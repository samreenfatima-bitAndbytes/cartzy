export default function ProductMedia({
  image,
  tone = "#C5D0C8",
  name,
  className = "",
}) {
  return (
    <div
      className={`product-media ${className}`}
      style={{ "--swatch": tone }}
    >
      {image ? (
        <img src={image} alt={name || ""} loading="lazy" />
      ) : (
        <div className="product-media-fallback" aria-hidden="true" />
      )}
    </div>
  );
}
