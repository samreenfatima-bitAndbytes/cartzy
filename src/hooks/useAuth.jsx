import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEMO_USER } from "../data/seed";

const KEY = "cartzy_auth_v1";
const Ctx = createContext(null);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read());

  const login = useCallback((email, password) => {
    if (
      email.trim().toLowerCase() === DEMO_USER.email &&
      password === DEMO_USER.password
    ) {
      const next = {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        fullName: DEMO_USER.fullName,
      };
      localStorage.setItem(KEY, JSON.stringify(next));
      setUser(next);
      return { ok: true };
    }
    return { ok: false, error: "Use the demo merchant credentials." };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
