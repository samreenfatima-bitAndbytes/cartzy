import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../hooks/useAuth.jsx";
import { useStore } from "../hooks/useStore";

const links = [
  { to: "/app", end: true, label: "Overview" },
  { to: "/app/products", label: "Products" },
  { to: "/app/orders", label: "Orders" },
  { to: "/app/shop", label: "Shop settings" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { shop, shops, setActiveShop } = useStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className={`app-shell ${menuOpen ? "app-shell--menu-open" : ""}`}>
      <header className="app-topbar">
        <Link to="/" className="brand brand--compact">
          <BrandLogo />
          Cartzy
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="app-side-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={menuOpen ? "menu-toggle-bars is-open" : "menu-toggle-bars"} />
        </button>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="app-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside id="app-side-nav" className="app-side">
        <div className="side-head">
          <Link to="/" className="brand brand--compact side-brand">
            <BrandLogo />
            Cartzy
          </Link>
          <button
            type="button"
            className="menu-toggle menu-toggle--side"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span className="menu-toggle-bars is-open" />
          </button>
        </div>
        <div className="side-shop-card">
          <img src={shop.banner || "/img/store-banner.jpg"} alt="" />
          <div>
            <strong>{shop.name}</strong>
            <span className="muted">/{shop.slug}</span>
          </div>
        </div>
        {shops.length > 1 ? (
          <label className="shop-switcher">
            <span className="muted">Active shop</span>
            <select
              value={shop.id}
              onChange={(e) => setActiveShop(e.target.value)}
              aria-label="Switch shop"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <nav className="side-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? "side-link active" : "side-link"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <Link className="btn btn-accent btn-block" to={`/s/${shop.slug}`}>
            Open storefront
          </Link>
          <button type="button" className="btn btn-ghost btn-block" onClick={logout}>
            Sign out · {user?.fullName?.split(" ")[0]}
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
