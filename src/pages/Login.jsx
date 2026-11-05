import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { DEMO_USER } from "../data/seed";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.password);
  const [error, setError] = useState("");

  if (user) {
    const dest = loc.state?.from?.pathname || "/app";
    return <Navigate to={dest} replace />;
  }

  function onSubmit(e) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate(loc.state?.from?.pathname || "/app");
  }

  return (
    <div className="auth-layout">
      <div className="auth-visual" aria-hidden="true">
        <img src="/img/login-desk.jpg" alt="" />
        <div className="auth-scrim" />
      </div>

      <header className="site-nav site-nav--sticky site-nav--auth">
        <Link to="/" className="brand">
          <BrandLogo />
          Cartzy
        </Link>
        <Link className="btn btn-ghost-light" to="/s/northloom">
          Sample shop
        </Link>
      </header>

      <div className="auth-page">
        <form className="auth-panel" onSubmit={onSubmit}>
          <p className="brand-hero brand-hero--sm">Cartzy</p>
          <h1>Merchant sign in</h1>
          <p className="muted">
            Demo · {DEMO_USER.email} / {DEMO_USER.password}
          </p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary btn-block">
            Enter builder
          </button>
          <Link className="text-link" to="/s/northloom">
            Skip to sample storefront →
          </Link>
        </form>
      </div>
    </div>
  );
}
