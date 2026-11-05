import { Link } from "react-router-dom";
import { useStore } from "../hooks/useStore";

export default function ShopSettings() {
  const { shop, shops, setActiveShop, updateShop } = useStore();

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Storefront</p>
          <h1>Shop settings</h1>
          <p className="muted">
            Tune branding for the active shop. Switch shops from the sidebar.
          </p>
        </div>
        <Link className="btn btn-accent" to={`/s/${shop.slug}`}>
          Open storefront
        </Link>
      </header>

      <div className="dash-hero dash-hero--compact">
        <img src={shop.banner || "/img/settings-brand.jpg"} alt="" />
        <div className="dash-hero-copy">
          <p className="eyebrow">Branding</p>
          <h2>{shop.name}</h2>
        </div>
      </div>

      {shops.length > 1 ? (
        <div className="panel shop-list-panel">
          <h2>Your shops</h2>
          <ul className="shop-list">
            {shops.map((s) => (
              <li key={s.id} className={s.id === shop.id ? "active" : ""}>
                <button type="button" onClick={() => setActiveShop(s.id)}>
                  <img src={s.banner} alt="" />
                  <span>
                    <strong>{s.name}</strong>
                    <span className="muted">/s/{s.slug}</span>
                  </span>
                </button>
                <Link className="btn btn-ghost" to={`/s/${s.slug}`}>
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        className="panel form-grid"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Shop name
          <input
            value={shop.name}
            onChange={(e) => updateShop({ name: e.target.value })}
          />
        </label>
        <label>
          URL slug
          <input
            value={shop.slug}
            onChange={(e) =>
              updateShop({
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-")
                  .replace(/-+/g, "-"),
              })
            }
          />
        </label>
        <label>
          Tagline
          <input
            value={shop.tagline}
            onChange={(e) => updateShop({ tagline: e.target.value })}
          />
        </label>
        <label>
          Accent color
          <input
            type="color"
            value={shop.accent}
            onChange={(e) => updateShop({ accent: e.target.value })}
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={shop.published}
            onChange={(e) => updateShop({ published: e.target.checked })}
          />
          Published on Cartzy
        </label>
        <p className="muted">
          Customer URL: <code>/s/{shop.slug}</code>
        </p>
      </form>
    </div>
  );
}
