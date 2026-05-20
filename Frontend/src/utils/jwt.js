// Decode JWT payload to read role (no extra library needed)
export function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const data = parseJwt(token);
  return data?.role ? String(data.role).toLowerCase() : null;
}
