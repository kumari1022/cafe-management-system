import { useEffect, useMemo, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
      },
    }),
    [token]
  );
}

