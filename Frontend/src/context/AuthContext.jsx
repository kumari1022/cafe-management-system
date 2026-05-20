import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { getRoleFromToken } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function validateSession() {
      const saved = localStorage.getItem("token");
      if (!saved) {
        setBooting(false);
        return;
      }
      try {
        await authService.checkToken();
        setToken(saved);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setBooting(false);
      }
    }
    validateSession();
  }, []);

  const role = useMemo(() => getRoleFromToken(token), [token]);

  const value = useMemo(
    () => ({
      token,
      role,
      booting,
      isAuthenticated: Boolean(token),
      isAdmin: role === "admin",
      isStaff: role === "staff",
      isUser: role === "user",
      login: (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
      },
    }),
    [token, role, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
